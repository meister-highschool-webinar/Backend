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
    request('https://docs.google.com/spreadsheets/d/1FmsQ74kT9O54VPk5SXr9q8BHs4OCNopDA_c_ZXyldvc/export?format=csv&id=1FmsQ74kT9O54VPk5SXr9q8BHs4OCNopDA_c_ZXyldvc&gid=792694193')
    .pipe(csv())
    .on('data', data => results.push(data))
    .on('end', () => {
      results.forEach(data => {
        const { '학교': schoolName, '학년': grade, '전공': major, '학교 외에 학습 관련 정보를 얻는 곳': info, '사용 언어': language, '향후 진출하고 싶은 분야': field, '향후 입사하고 싶은 기업': company} = data;
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