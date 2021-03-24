import { Component, OnDestroy, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { User } from '../../models/user.model';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-user-form',
  templateUrl: './user-form.component.html',
  styleUrls: ['./user-form.component.css'],
})
export class UserFormComponent implements OnInit, OnDestroy {
  isAuth: boolean;
  authSubscription: Subscription;
  userForm: FormGroup;
  user: User;
  id: string = this.auth.getUserId();
  imagePreview: string;
  errorMsg: string;
  mode: string;
  edit = false;

  constructor(
    private fB: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private auth: AuthService
  ) {}

  ngOnInit(): void {
    this.authSubscription = this.auth.isAuth$.subscribe((auth) => {
      this.isAuth = auth;
    });
    this.route.params.subscribe((params) => {
      if (!params.id) {
        this.mode = 'new';
        this.initEmptyForm();
      } else {
        this.mode = 'edit';
        this.auth.getUser(params.id).subscribe((user: User) => {
          this.user = user;
          this.initModifyForm();
        });
      }
    });
  }

  initEmptyForm(): void {
    this.userForm = this.fB.group(
      {
        photo: [null],
        firstname: [
          null,
          [
            Validators.required,
            Validators.minLength(2),
            Validators.maxLength(45),
          ],
        ],
        lastname: [
          null,
          [
            Validators.required,
            Validators.minLength(2),
            Validators.maxLength(45),
          ],
        ],
        department: [null, Validators.required],
        email: [null, [Validators.required, Validators.email]],
        password: [
          null,
          [
            Validators.required,
            Validators.pattern(
              '(?=\\D*\\d)(?=[^a-z]*[a-z])(?=[^A-Z]*[A-Z]).{8,25}'
            ),
          ],
        ],
        password2: [null, Validators.required],
      },
      { validators: this.MustMatch('password', 'password2') }
    );
  }

  initModifyForm(): void {
    const usermodify = this.user[0];
    this.userForm = this.fB.group(
      {
        photo: [null],
        firstname: [
          usermodify.firstname,
          [
            Validators.required,
            Validators.minLength(2),
            Validators.maxLength(45),
          ],
        ],
        lastname: [
          usermodify.lastname,
          [
            Validators.required,
            Validators.minLength(2),
            Validators.maxLength(45),
          ],
        ],
        department: [usermodify.department, Validators.required],
        // email: [usermodify.email, [Validators.required, Validators.email]],
        password: [
          null,
          [
            Validators.required,
            Validators.pattern(
              '(?=\\D*\\d)(?=[^a-z]*[a-z])(?=[^A-Z]*[A-Z]).{8,25}'
            ),
          ],
        ],
        password2: [null, Validators.required],
      },
      {
        validators: this.MustMatch('password', 'password2'),
      }
    );
  }

  onSubmit(): void {
    const newUser = { ...this.userForm.value };
    delete newUser.photo;
    delete newUser.password2;
    const photo = this.userForm.get('photo').value;

    if (this.mode === 'new') {
      this.auth
        .createUser(newUser, photo)
        .subscribe(() => this.router.navigate(['user/login']));
    } else if (this.mode === 'edit') {
      this.auth
        .modifyUser(this.id, newUser, photo)
        .subscribe(() => this.router.navigate(['user/:id']));
    }
  }

  onFileAdded(event: Event): void {
    const file = (event.target as HTMLInputElement).files[0];
    this.userForm.get('photo').setValue(file);
    this.userForm.updateValueAndValidity();
    const reader = new FileReader();
    reader.onload = () => {
      this.imagePreview = reader.result as string;
    };
    reader.readAsDataURL(file);
  }

  get f(): any {
    return this.userForm.controls;
  }

  MustMatch(controlName: string, matchingControlName: string): any {
    return (formGroup: FormGroup) => {
      const control = formGroup.controls[controlName];
      const matchingControl = formGroup.controls[matchingControlName];

      if (matchingControl.errors && !matchingControl.errors.mustMatch) {
        return;
      }
      if (control.value !== matchingControl.value) {
        matchingControl.setErrors({ mustMatch: true });
      } else {
        matchingControl.setErrors(null);
      }
    };
  }

  onBack(): void {
    this.router.navigate(['/post']);
  }

  ngOnDestroy(): void {
    this.authSubscription.unsubscribe();
  }
}
