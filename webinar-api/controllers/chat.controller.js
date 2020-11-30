const { io } = require('../modules/websocket');
const { chatLog } = require('../models');

exports.removeAllChat = async(req, res) => {
    try {
        io().emit('remove_all_chat', true)
        return res.status(200).send({
            msg: '성공적으로 전체 채팅 삭제 요청을 하였습니다',
            msgId: 200
        })
    } catch (e) {
        res.sendStatus(500);
    }
}

exports.removeAllQnaChat = async(req, res) => {
    try {
        io().emit('remove_all_qna', true)
        return res.status(200).send({
            msg: '성공적으로 전체 질문 채팅 삭제 요청을 하였습니다',
            msgId: 200
        })
    } catch (e) {
        res.sendStatus(500);
    }
}

exports.refreshPage = async(req, res) => {
    try {
        io().emit('refresh_page', true)
        return res.status(200).send({
            msg: '성공적으로 전체 강제 새로고침 요청을 하였습니다',
            msgId: 200
        })
    } catch (e) {
        res.sendStatus(500);
    }
}

exports.getAllChat = async(req, res) => {
    try {
        const chat = (await chatLog.findAll({
            attributes: ["msg_id", "student_name", "question", "create_time", "text"],
            where: {
                deleted_flag: null
            }
        }));
        io().emit('refresh_page', { chatList: chat })
        return res.status(200).send({
            msg: '성공적으로 전체 채팅로그를 보냈습니다',
            msgId: 200
        })
    } catch (e) {
        console.log(e)
        res.sendStatus(500);
    }
}