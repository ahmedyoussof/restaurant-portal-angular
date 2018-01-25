import { Component, OnInit, Inject } from '@angular/core';
import { Dish } from '../shared/dish';

import { DishService } from '../services/dish.service';

import { Params, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Comment } from '../shared/comment';

import 'rxjs/add/operator/switchMap';




@Component({
  selector: 'app-dishdetail',
  templateUrl: './dishdetail.component.html',
  styleUrls: ['./dishdetail.component.scss']
})
export class DishdetailComponent implements OnInit {

  dishFeedbackForm: FormGroup;
  dishFeedback: Comment; 

  formErrors = {
    'author': '',
    'rating': '',
    'comment': ''
  };

  validationMessages = {
    'author': {
      'required':      'Name is required.',
      'minlength':     'Name must be at least 2 characters long.'
    },
    'comment': {
      'required':      'Comment is required.'
    },

  };

  dish: Dish;
  dishIds: number[];
  prev: number;
  next: number;

  errMess: string;

  constructor(private dishservice: DishService,
    private route: ActivatedRoute,
    private location: Location,
    private fb: FormBuilder,
    @Inject('BaseURL') private BaseURL) {
      this.createForm();
     }

  ngOnInit() {
    this.dishservice.getDishIds().subscribe(dishIds => this.dishIds = dishIds);
    this.route.params
      .switchMap((params: Params) => this.dishservice.getDish(+params['id']))
      .subscribe(dish => { this.dish = dish; this.setPrevNext(dish.id); },
      errmess => this.errMess = <any>errmess);
      
    
  }

  setPrevNext(dishId: number) {
    let index = this.dishIds.indexOf(dishId);
    this.prev = this.dishIds[(this.dishIds.length + index - 1)%this.dishIds.length];
    this.next = this.dishIds[(this.dishIds.length + index + 1)%this.dishIds.length];
  }

  goBack(): void {
    this.location.back();
  }

  createForm() {
    this.dishFeedbackForm = this.fb.group({
      author: ['', [Validators.required, Validators.minLength(2)]],
      rating: [5, Validators.required],
      comment: ['', Validators.required]
    });

    this.dishFeedbackForm.valueChanges
    .subscribe(data => this.onValueChanged(data));

  this.onValueChanged(); // (re)set validation messages now
  }

  onSubmit() {
    this.dishFeedback = this.dishFeedbackForm.value;

    var d = new Date();
    var n = d.toISOString();
    this.dishFeedback.date = n;

    this.dish.comments.push(this.dishFeedback);
    console.log(this.dishFeedback);
    this.dishFeedbackForm.reset({
      author: '',
      rating: '',
      comment: ''
    });
  }

  onValueChanged(data?: any) {
    if (!this.dishFeedbackForm) { return; }
    const form = this.dishFeedbackForm;
    for (const field in this.formErrors) {
      // clear previous error message (if any)
      this.formErrors[field] = '';
      const control = form.get(field);
      if (control && control.dirty && !control.valid) {
        const messages = this.validationMessages[field];
        for (const key in control.errors) {
          this.formErrors[field] += messages[key] + ' ';
        }
      }
    }
  }  
}
