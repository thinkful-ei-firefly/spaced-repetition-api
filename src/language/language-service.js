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

  getNextWord(db, id) {
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
      .first();
  },

  makeLinkedList(words) {
    const list = new LinkedList();
    words.forEach(word => list.insertLast(word));
    return list;
  },

  updateTotalScore(db, language_id, total) {
    return db('language')
      .where({ language_id })
      .update({total_score: total});
  }
};

module.exports = LanguageService;
