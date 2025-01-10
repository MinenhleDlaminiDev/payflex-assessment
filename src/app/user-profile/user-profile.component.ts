import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormControl, FormGroup, Validators } from '@angular/forms';
import { UserService } from '../user.service';

@Component({
  selector: 'app-user-profile',
  standalone: true,
  imports: [ReactiveFormsModule,CommonModule],
  template: `
    <div class="tab">
      Minenhle Dlamini Assessment Submition
    </div>

    <div class="content">
      <div *ngIf="loading" class="loading">Loading profile data...</div>
      <div *ngIf="error" class="error-message">{{ error }}</div>

      <div *ngIf="!loading && !error" class="row">
        <div class="col-sm-3">Dashboard Sidebar</div>
        <div class="col-sm-9">
          <div class="cover"></div>
          <div class="profile-picture">
            <img src="/assets/profile.jpg" alt="Profile Picture">
          </div>
          <div class="name">
            <h3>{{ profileData.fullname }}</h3>
            <button type="button" class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#exampleModal" >Edit Profile</button>
          </div>
          <div class="row row2">
            <div class="col-sm">
              <p>Phone Number</p>
              <h6>+{{ profileData.phone }}</h6>
            </div>
            <div class="col-sm">
              <p>ID Number</p>
              <h6>{{ profileData.idNumber }}</h6>
            </div>
            <div class="col-sm">
              <p>Email Address</p>
              <h6>{{ profileData.email }}</h6>
            </div>
            <div class="col-sm">
              <p>Country</p>
              <h6>{{ profileData.country }}</h6>
            </div>
          </div>
          <p class="hob">Hobbies</p>
          <div class="hobbies">
            <p class="hobby" *ngFor="let hobby of hobbies">{{ hobby }}</p>
          </div>
        </div>
      </div>
    </div>


      <!-- Modal -->
      <div class="modal fade" id="exampleModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
        <div class="modal-dialog">
          <div class="modal-content">
            <div class="modal-header">
              <h1 class="modal-title fs-5" id="exampleModalLabel">Update Information</h1>
              <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
              <form class="form" [formGroup]="profileForm">
                <div>
                  <label class="label">Full Name</label>
                  <br />
                  <input type="text" class="input" formControlName="fullname" required/>
                  <div *ngIf="profileForm.get('fullname')?.invalid" class="error"><small class="text-danger">Invalid full name.</small></div>
                  <br/>

                  <label class="label">Phone Number</label>
                  <br />
                  <input type="text" class="input" formControlName="phone" required/>
                  <div *ngIf="profileForm.get('phone')?.invalid" class="error"><small class="text-danger">Invalid phone number (e.g 27820818204)</small></div>
                  <br/>

                  <label class="label">ID Number</label>
                  <br />
                  <input type="text" class="input"formControlName="idNumber" />
                  <div *ngIf="profileForm.get('idNumber')?.invalid" class="error"><small class="text-danger">Invalid ID Number (13 digits)</small></div>
                  <br/>

                  <label class="label">Email Address</label>
                  <br />
                  <input type="text" class="input" formControlName="email"/>
                  <div *ngIf="profileForm.get('email')?.invalid" class="error"><small class="text-danger">Invalid email address (e.g xxxb&#64;example.com)</small></div>
                  <br/>

                  <label class="label">Country</label>
                  <br />
                  <input type="text" class="input" formControlName="country" required/>
                  <div *ngIf="profileForm.get('country')?.invalid" class="error"><small class="text-danger">Country Field cannot be empty</small></div>
                  <br/>
                  <br/>
                </div>
              </form>
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
              <button type="button" class="btn btn-primary" (click)="onSaveChanges()" [disabled]="profileForm.get('fullname')?.invalid || profileForm.get('phone')?.invalid || profileForm.get('idNumber')?.invalid || profileForm.get('email')?.invalid || profileForm.get('country')?.invalid" data-bs-dismiss="modal">Save changes</button>
            </div>
          </div>
        </div>
      </div>
  `,
  styleUrl: './user-profile.component.css',
  })
export class UserProfileComponent implements OnInit {

  proData: any = {};
  loading = true;
  error: string | null = null;

  constructor(private userService: UserService) { }
  ngOnInit(): void{
    this.fetchProfile();
  }

  fetchProfile() {
    this.loading = true;
    this.error = null;

    this.userService.getUser().subscribe({
      next: (response) => {
        console.log('Response:', response);
        this.proData = response.data;
        this.loading = false;

        // Updated profile values
        this.profileData = {
          fullname: this.proData.fullname,
          phone: this.proData.phone,
          idNumber: this.proData.idNumber,
          email: this.proData.email,
          country: this.proData.country,
        }
        
        // Update the form controls
        this.profileForm.patchValue(this.profileData);
      },
      error: (err) => {
        console.error('Error:', err);
        this.loading = false;
        this.error = 'Failed to load profile data. Please try again later.';
      }
    });
  }

  // list of hobbies
  hobbies = ['football', 'basketball', 'painting', 'photography'];

  // Initial Profile Data
  profileData = {
    fullname: '',
    phone: '',
    idNumber: '',
    email: '',
    country: '',
  }

  profileForm = new FormGroup({
    fullname: new FormControl(this.profileData.fullname, [Validators.required, Validators.pattern('^[^0-9]*$')]),
    phone: new FormControl(this.profileData.phone, [Validators.required, Validators.pattern('^[0-9]{11}$')]),
    idNumber: new FormControl(this.profileData.idNumber, [Validators.required, Validators.pattern('^[0-9]{13}$')]),
    email: new FormControl(this.profileData.email, [Validators.required, Validators.email]),
    country: new FormControl(this.profileData.country, [Validators.required]),
  });


  onSaveChanges() {
    if (this.profileForm.valid){
      const updatedProfile = this.profileForm.value;

      // Update the profile data with new values (use nullish coalscing operator)
      this.profileData.fullname = updatedProfile.fullname ?? '';
      this.profileData.idNumber = updatedProfile.idNumber ?? '';
      this.profileData.phone = updatedProfile.phone ?? '';
      this.profileData.email = updatedProfile.email ?? '';
      this.profileData.country = updatedProfile.country ?? '';
     
      alert("Profile updated successfully!");
    } else {
      alert("Invalid form error submitting");
    }
  }
}
