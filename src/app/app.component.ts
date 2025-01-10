import { Component } from '@angular/core';
import { UserProfileComponent } from './user-profile/user-profile.component';



@Component({
  selector: 'app-root',
  template: `
    <header>
      <nav class="navigation navbar navbar-expand-lg navabar-light bg-white">
        <div class="nav-left">
          <img src="/assets/logo.png" alt="Payflex Logo">
        </div>

        <button class="navbar-toggler " type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
          <span class="navbar-toggler-icon"></span>
        </button>
        
        <div class="nav-right collapse navbar-collapse">
          <ul class="navbar-nav ms-auto">
            <li>Profile</li>
            <li>Orders</li>
            <li>Payments</li>
          </ul>
        </div>
      </nav>
    </header>
    <section class="content">
      <app-user-profile></app-user-profile>
    </section>
    <footer></footer>
  `,
  styleUrl: './app.component.css',
  imports: [UserProfileComponent]
})
export class AppComponent {
  title = 'payflex-test';
}
