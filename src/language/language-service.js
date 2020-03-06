const LinkedList = require('../linked-list');

const LanguageService = {
  getUsersLanguage(db, user_id) {
    return db
      .from('language')
      .select(
        'language.id',
        'language.name',
        'language.user_id',
        'language.head',
        'language.total_score'
      )
      .where('language.user_id', user_id)
      .first();
  },

  getLanguageWords(db, language_id) {
    return db
      .from('word')
      .select(
        'id',
        'language_id',
        'original',
        'translation',
        'next',
        'memory_value',
        'correct_count',
        'incorrect_count'
      )
      .where({ language_id });
  },

  getNextWord(db, id, language_id) {
    return db
      .from('word')
      .select(
        'id',
        'language_id',
        'original',
        'translation',
        'next',
        'memory_value',
        'correct_count',
        'incorrect_count'
      )
      .where({ id })
      .where({ language_id })
      .first();
  },

  makeLinkedList(words) {
    const list = new LinkedList();
    words.forEach(word => list.insertLast(word));
    return list;
  },

  updateTotalScore(db, id, total) {
    return db('language')
      .where({ id })
      .update({ total_score: total });
  },

  updateWord(db, id, data) {
    return db('word')
      .where({ id })
      .update({ ...data });
  }
};

module.exports = LanguageService;
