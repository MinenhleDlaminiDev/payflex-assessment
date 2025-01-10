import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { UserProfileComponent } from './user-profile.component';
import { UserService } from '../user.service';
import { of, throwError } from 'rxjs';

describe('UserProfileComponent', () => {
  let component: UserProfileComponent;
  let fixture: ComponentFixture<UserProfileComponent>;
  let userService: UserService;

  const mockUserData = {
    fullname: 'John Doe',
    phone: '27820818204',
    idNumber: '1234567890123',
    email: 'john.doe@example.com',
    country: 'South Africa'
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserProfileComponent, HttpClientTestingModule],
      providers: [UserService]
    }).compileComponents();

    fixture = TestBed.createComponent(UserProfileComponent);
    component = fixture.componentInstance;
    userService = TestBed.inject(UserService);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should fetch profile data successfully', () => {
    spyOn(userService, 'getUser').and.returnValue(of({ data: mockUserData }));

    component.fetchProfile();

    expect(component.loading).toBeFalse();
    expect(component.error).toBeNull();
    expect(component.profileData).toEqual(mockUserData);
  });

  it('should handle error when fetching profile data', () => {
    spyOn(userService, 'getUser').and.returnValue(throwError(() => new Error('Network error')));

    component.fetchProfile();

    expect(component.loading).toBeFalse();
    expect(component.error).toBe('Failed to load profile data. Please try again later.');
  });

  it('should show error message when form is invalid', () => {
    component.profileForm.patchValue({ fullname: '' }); // Invalid form
    spyOn(window, 'alert');

    component.onSaveChanges();

    expect(window.alert).toHaveBeenCalledWith('Invalid form error submitting');
  });

  it('should update profile data successfully', () => {
    component.profileForm.patchValue(mockUserData);
    spyOn(window, 'alert');

    component.onSaveChanges();

    expect(component.profileData).toEqual(mockUserData);
    expect(window.alert).toHaveBeenCalledWith('Profile updated successfully!');
  });
});
