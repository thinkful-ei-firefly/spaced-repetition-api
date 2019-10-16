const express = require('express');
const LanguageService = require('./language-service');
const { requireAuth } = require('../middleware/jwt-auth');

const languageRouter = express.Router();
const jsonParser = express.json();

languageRouter.use(requireAuth).use(async (req, res, next) => {
  try {
    const language = await LanguageService.getUsersLanguage(
      req.app.get('db'),
      req.user.id
    );

    if (!language)
      return res.status(404).json({
        error: `You don't have any languages`
      });

    req.language = language;
    next();
  } catch (error) {
    next(error);
  }
});

languageRouter.get('/', async (req, res, next) => {
  try {
    const words = await LanguageService.getLanguageWords(
      req.app.get('db'),
      req.language.id
    );

    res.json({
      language: req.language,
      words
    });
    next();
  } catch (error) {
    next(error);
  }
});

languageRouter.get('/head', async (req, res, next) => {
  try {
    const word = await LanguageService.getNextWord(
      req.app.get('db'),
      req.language.head
    );

    res.json({
      nextWord: word.original,
      totalScore: req.language.total_score,
      wordCorrectCount: word.correct_count,
      wordIncorrectCount: word.incorrect_count
    })
    next();
  }
  catch (error) {
    next(error)
  }
});

languageRouter.post('/guess', jsonParser, async (req, res, next) => {
  try {
    if (!req.body.guess) {
      res.status(400).json({ error: 'Guess can\'t be empty' })
    }

    const { guess } = req.body;
    const words = await LanguageService.getLanguageWords(req.app.get('db'), req.language.id);
    const list = LanguageService.makeLinkedList(words);
    const response = {};
    
    if (guess.toLowerCase() === list.head.value.translation.toLowerCase()) {
      response.iscorrect = true;
      list.head.value.correct_count++;
      response.wordcorrectcount = list.head.value.correct_count;
      response.wordincorrectcount = list.head.value.incorrect_count;
      list.head.value.memory_value *= 2;
      const total = req.language.total_score;
      total++;
      LanguageService.updateTotalScore(
        req.app.get('db'),
        req.language.id,
        total
      );
      response.totalscore = total;
      const listSize = list.size();
      const currHead = list.head;
      if (list.head.value.memory_value > listSize) {
        list.remove(list.head);
        list.insertLast(currHead);
      } else {
        list.remove(list.head);
        list.insertAt(list.head.value.memory_value, currHead);
      }
    } else {
      response.iscorrect = false;
      list.head.value.incorrect_count++;
      response.wordincorrectcount = list.head.value.incorrect_count;
      response.wordcorrectcount = list.head.value.correct_count;
      response.totalscore = req.language.total_score;
      list.head.value.memory_value = 1;
      const currHead = list.head;
      list.remove(list.head);
      list.insertAt(1, currHead);
    }
    
    // need method for persisting here
    
    response.nextword = list.head;
    response.answer = req.body.guess.toLowerCase();
    
    res.status(200).json(response);
    
  }
  catch (error) {
    next(error)
  }
});

module.exports = languageRouter;
