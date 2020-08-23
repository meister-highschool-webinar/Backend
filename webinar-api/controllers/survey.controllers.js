const csv = require('csv-parser');
const request = require('request');

const addToQna = (qna, property) => {
  property.split(", ").forEach(data => {
    const idx = qna.findIndex(el => el.name === data);
    if(idx !== -1) {
      qna[idx].count++;
    }
    else {
      qna.push({
        name: data,
        count: 1
      })
    }
  })
}

exports.qna = async (req, res) => {
  const results = [];
  const qna = {
    school: [],
    grade: [],
    major: [],
    info: [],
    language: [],
    field: [],
    company: []
  }

  try {
    request('https://docs.google.com/spreadsheets/d/1fmA9A0cDey9PS69cdaRTw4SdQ4nP2-HFrw9m62-lGts/export?format=csv&id=1fmA9A0cDey9PS69cdaRTw4SdQ4nP2-HFrw9m62-lGts&gid=210713919')
    .pipe(csv())
    .on('data', data => results.push(data))
    .on('end', () => {
      results.forEach(data => {
        const { 
          '학교': schoolName, 
          '학년': grade, 
          '전공': major, 
          '학교 외에 학습 관련 정보를 얻는 곳(중복선택 가능)': info, 
          '사용 언어(중복선택 가능)': language, 
          '향후 진출하고 싶은 분야(중복선택 가능)': field, 
          '향후 입사하고 싶은 기업(중복선택 가능)': company
        } = data;

        addToQna(qna.school, schoolName);
        addToQna(qna.grade, grade);
        addToQna(qna.major, major);
        addToQna(qna.info, info);
        addToQna(qna.language, language);
        addToQna(qna.field, field);
        addToQna(qna.company, company);
      })
      res.status(200).send({
        qna
      })
    })
  }
  catch (error) {
    res.status(500).send({
      msg: '서버 오류가 발생했습니다.',
      msgId: 500
    })
  }
}