import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { Router, ActivatedRoute } from '@angular/router';
import { User } from 'src/app/models/user.model';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-profil',
  templateUrl: './profil.component.html',
  styleUrls: ['./profil.component.css'],
})
export class ProfilComponent implements OnInit {
  @Input()
  user: User;
  admin = false;
  isOwner = false;
  @Output()
  refreshUser = new EventEmitter();

  userForm: FormGroup;
  userId = this.auth.getUserId();
  imagePreview: string;
  closeResult: string;

  constructor(
    private auth: AuthService,
    private fB: FormBuilder,
    private modalService: NgbModal,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  // Initialisation
  ngOnInit(): void {
    this.initDataUser();
    this.verifAdmin();
  }

  verifAdmin(): void {
    if (this.auth.getAdmin(this.userId) === 'TRUE') {
      this.admin = true;
    }
    this.route.params.subscribe((params) => {
      if (params.id == this.userId) {
        this.isOwner = true;
      }
    });
  }

  initDataUser(): void {
    this.route.params.subscribe((params) => {
      if (params) {
        this.auth
          .getUser(params.id)
          .subscribe((user: User) => (this.user = user[0]));
      }
    });
  }

  // Profil
  onDelete(): void {
    this.route.params.subscribe((params) => {
      if (params) {
        this.auth.deleteUser(params.id).subscribe(() => {
          if (this.admin == true) {
            this.router.navigate(['/post']);
          } else {
            this.auth.logout();
            this.router.navigate(['/user/login']);
          }
        });
      }
    });
  }

  onBack(): void {
    this.router.navigate(['/post']);
  }

  // Modal

  onSubmit(): void {
    const modifUser = { ...this.userForm.value };
    delete modifUser.photo;
    delete modifUser.password2;
    const photo = this.userForm.get('photo').value;
    this.auth.modifyUser(this.userId, modifUser, photo).subscribe(() => {
      this.initDataUser();
    });
  }

  get f(): object {
    return this.userForm.controls;
  }

  open(content, user): void {
    this.userForm = this.fB.group(
      {
        photo: [null],
        firstname: [
          user.firstname,
          [
            Validators.required,
            Validators.minLength(2),
            Validators.maxLength(45),
          ],
        ],
        lastname: [
          user.lastname,
          [
            Validators.required,
            Validators.minLength(2),
            Validators.maxLength(45),
          ],
        ],
        department: [user.department, Validators.required],
        email: [user.email, [Validators.required, Validators.email]],
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
    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' });
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

  onFileAdded(event: Event): void {
    const file = (event.target as HTMLInputElement).files[0];
    this.userForm.get('photo').setValue(file);
    this.userForm.updateValueAndValidity();
    const reader = new FileReader();
    reader.onload = () => (this.imagePreview = reader.result as string);
    reader.readAsDataURL(file);
  }
}
