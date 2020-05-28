var express = require('express');
var router = express.Router();

let request = require('request-promise')
let superagent = require('superagent');
let bodyParser = require('body-parser');
let formidable = require('formidable');
let fs = require('fs');
let path = require('path');
let config = require('../modules/config')


/* GET home page. */
router.get('/', function (req, res, next) {
    res.render('index', {title: 'Miao-CMS'});
});

router.post('/uploadBannerImg', function (req, result, next) {

    // 图片上传操作
    let form = new formidable.IncomingForm();
    form.parse(req, (err, files, file) => {
        // console.log(files);
        // console.log(file);
        /* 1.上传[将图片从本地，上传到服务器]
        获取文件所在的位置 - 读取的管道流 - 管道流写的方式写进去 - 管道流
        */
        // let read = fs.createReadStream(file.userImg.path);


        let _typeStr = file.userImg.type;
        _typeStr = _typeStr.split("/")[1];
        console.log('_typeStr: ', _typeStr);
        let fileName = `${Date.now()}.${_typeStr}`;
        let filePath = `banner/${fileName}`;

        superagent
            .get('https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential')
            .query({appid: config.appid})
            .query({secret: config.secret})
            .end((err, res) => {
                let access_token = res.body.access_token;

                superagent
                    .post('https://api.weixin.qq.com/tcb/uploadfile')
                    .query({access_token: access_token})
                    .send({env: 'miaomiao-dev-id'})
                    .send({path: filePath})
                    .end((err, res) => {
                        superagent
                            .post('https://api.weixin.qq.com/tcb/databaseadd')
                            .query({access_token: access_token})
                            .send({env: 'miaomiao-dev-id'})
                            .send({query: "db.collection('banner').add({ data: { fileId: '" + res.body.file_id + "'} })"})
                            .end((err, res) => {
                                // console.log(res);
                            });


                        let options = {
                            method: 'POST',
                            uri: res.body.url,
                            formData: {
                                'Signature': res.body.authorization,
                                'key': filePath,
                                'x-cos-security-token': res.body.token,
                                'x-cos-meta-fileid': res.body.cos_file_id,
                                'file': {
                                    value: fs.createReadStream(file.userImg.path),
                                    options: {
                                        filename: fileName,
                                        contentType: file.userImg.type
                                    }
                                }
                            }
                        }
                        request(options).then((res) => {
                            result.render('index', {title: 'Miao-CMS'});

                        })


                    });


            });


    })

    // res.send('respond with uploadBanner...');
});

module.exports = router;
