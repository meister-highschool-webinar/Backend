const { io } = require('../modules/websocket');

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