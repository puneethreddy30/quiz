import { Component, OnInit } from '@angular/core';
import { QuizService } from '../services/quiz.service';
import { ActivatedRoute, Router } from '@angular/router';
import {map} from 'rxjs/operators';
import * as es6printJS from "print-js";


//import { HelperService } from '../services/helper.service';
import { Option, Question, Quiz, QuizConfig } from '../models/index';

@Component({
  selector: 'app-quiz',
  templateUrl: './quiz.component.html',
  styleUrls: ['./quiz.component.css'],
  providers: [QuizService]
})
export class QuizComponent implements OnInit {
  quizes: any[];
  quiz: Quiz = new Quiz(null);
  timedOut: boolean = false;
  scoredOnce: boolean = false;
  wrong = 0;
  score = 0;
  mode = 'quiz';
  quizName: string;
  config: QuizConfig = {
    'allowBack': true,
    'allowReview': true,
    'autoMove': false,  // if true, it will move to next question automatically when answered.
    'duration': 300,  // indicates the time (in secs) in which quiz needs to be completed. 0 means unlimited.
    'pageSize': 1,
    'requiredAll': false,  // indicates if you must answer all the questions before submitting.
    'richText': false,
    'shuffleQuestions': false,
    'shuffleOptions': false,
    'showClock': false,
    'showPager': true,
    'theme': 'none'
  };

  pager = {
    index: 0,
    size: 1,
    count: 1
  };
  timer: any = null;
  startTime: Date;
  endTime: Date;
  ellapsedTime = '00:00';
  duration = '';
  _Activatedroute: any;

  constructor(
    private quizService: QuizService,
    //private helperService: HelperService,
    private _router:Router,
    public route: ActivatedRoute
    
    ) { 

    }
    
    id: any;

  ngOnInit() {

    this.quizes = this.quizService.getAll();

    this.id = this.route.snapshot.paramMap.get('id');
    this.quizName = this.quizes[this.id].id;
   this.loadQuiz(this.quizName);
  }

  loadQuiz(quizName: string) {
    this.quizService.get(quizName).subscribe(res => {
      this.quiz = new Quiz(res);
      this.pager.count = this.quiz.questions.length;
      this.startTime = new Date();
      this.ellapsedTime = '00:00';
      this.timer = setInterval(() => { this.tick(); }, 1000);
      this.duration = this.parseTime(this.config.duration);
    });
    this.mode = 'quiz';
  }

  printTest() {
    console.log('in printtest')
    es6printJS("qwe", "html");
    }

  tick() {
    if(!this.timedOut){
      const now = new Date();
      const diff = (now.getTime() - this.startTime.getTime()) / 1000;
      if (diff >= this.config.duration) {
        this.timedOut = true;
        this.onSubmit();
        
      }
      
      this.ellapsedTime = this.parseTime(diff);
    }
  }

  parseTime(totalSeconds: number) {
    let mins: string | number = Math.floor(totalSeconds / 60);
    let secs: string | number = Math.round(totalSeconds % 60);
    mins = (mins < 10 ? '0' : '') + mins;
    secs = (secs < 10 ? '0' : '') + secs;
    return `${mins}:${secs}`;
  }

  get filteredQuestions() {
    return (this.quiz.questions) ?
      this.quiz.questions.slice(this.pager.index, this.pager.index + this.pager.size) : [];
  }

  onSelect(question: Question, option: Option) {
    if (question.questionTypeId === 1) {
      question.options.forEach((x) => { if (x.id !== option.id) x.selected = false; });
    }

    if (this.config.autoMove) {
      this.goTo(this.pager.index + 1);
    }
  }

  goTo(index: number) {
    if (index >= 0 && index < this.pager.count) {
      this.pager.index = index;
      this.mode = 'quiz';
    }
  }

  isAnswered(question: Question) {
    return question.options.find(x => x.selected) ? 'Answered' : 'Not Answered';
  };

  isCorrect(question: Question) {
    return question.options.every(x => x.selected === x.isAnswer) ? 'correct' : 'wrong';
  };

  onSubmit() {

    let answers = [];
    //console.log(this.quiz.questions)
    this.quiz.questions.forEach(x => answers.push({ 'quizId': this.quiz.id, 'questionId': x.id, 'answered': x.answered }));
    
    //console.log(this.quiz.questions)
    // Post your data to the server here. answers contains the questionId and the users' answer.
  
    
    
    let attempted = 0;
    //let score = 0;

  
    
    for (const key in this.quiz.questions) {
      if (this.quiz.questions.hasOwnProperty(key)) {
        const element = this.quiz.questions[key];
        for (const iterator of element.options) {
          if(iterator.selected){
            attempted++;
          }
        }   
      }
    }

    console.log(attempted);
    if(!this.timedOut){
      if (answers.length == attempted){
        this.mode = 'result';

        for (const key in this.quiz.questions) {
          if (this.quiz.questions.hasOwnProperty(key)) {
            const element = this.quiz.questions[key];
            for (const iterator of element.options) {
              if(iterator.selected && iterator.isAnswer){
                this.score++;
              }
            }   
          }
        }
        this.wrong = answers.length-this.score;
        console.log('correct:', this.score, 'Incorrect:', this.wrong);
        this.scoredOnce=true;
      }
      else {

        alert("Attempt all questions")
      
      }
    }      
    else{
      if(!this.scoredOnce){
      for (const key in this.quiz.questions) {
        if (this.quiz.questions.hasOwnProperty(key)) {
          const element = this.quiz.questions[key];
          for (const iterator of element.options) {
            if(iterator.selected && iterator.isAnswer){
              this.score++;
            }
          }   
        }
      }
      this.wrong = answers.length-this.score;
      this.scoredOnce=true;
    }
    this.mode = 'result';
           

    }
  
    //console.log(this.quiz.questions);

  }
}
