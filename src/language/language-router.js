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

    console.log(req.language.id);
    
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
      req.language.head,
      req.language.id
    );

    console.log(req.language.id);

    res.json({
      nextWord: word.original,
      totalScore: req.language.total_score,
      wordCorrectCount: word.correct_count,
      wordIncorrectCount: word.incorrect_count
    });
    next();
  } catch (error) {
    next(error);
  }
});

languageRouter.post('/guess', jsonParser, async (req, res, next) => {
  try {
    const { guess } = req.body;

    if (!req.body.guess) {
      return res.status(400).json({ error: `Missing 'guess' in request body` });
    }

    const words = await LanguageService.getLanguageWords(
      req.app.get('db'),
      req.language.id
    );

    if (guess.toLowerCase() === words[0].translation.toLowerCase()) {
      words[0].correct_count++;
      words[0].memory_value *= 2;
      req.language.total_score++;
    } else {
      words[0].incorrect_count++;
      words[0].memory_value = 1;
    }

    const list = LanguageService.makeLinkedList(words);
    const listSize = list.size();

    if (list.head.value.memory_value > listSize) {
      list.remove(words[0]);
      list.insertLast(words[0]);
    } else {
      list.remove(words[0]);
      list.insertAt(words[0].memory_value, words[0]);
    }

    const arr = list.displayList();

    for (let i = 0; i < arr.length; i++) {
      if (arr[i + 1]) {
        arr[i].next = arr[i + 1].id;
      } else {
        arr[i].next = null;
      }
      await LanguageService.updateWord(req.app.get('db'), arr[i].id, arr[i]);
    }

    await LanguageService.updateTotalScore(
      req.app.get('db'),
      req.language.id,
      req.language.total_score
    );

    response = {
      nextWord: arr[0].original,
      wordCorrectCount: arr[0].correct_count,
      wordIncorrectCount: arr[0].incorrect_count,
      totalScore: req.language.total_score,
      answer: words[0].translation,
      isCorrect: guess.toLowerCase() === words[0].translation.toLowerCase()
    };

    return res.status(200).json(response);
  } catch (error) {
    next(error);
  }
});

module.exports = languageRouter;
