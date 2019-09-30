import { Component, ChangeDetectionStrategy
} from '@angular/core';
import { AppService } from './app.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { Subscription } from 'rxjs';
import { FilterOptions } from './app.service';

@Component({
  selector: 'my-app',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent {
  initialOptions: FilterOptions = {
    searchFilter: '',
    hideDisabledRecipes: false
  };
  optionForm: FormGroup = this.fb.group(this.initialOptions);
  subscription: Subscription;

  constructor(private fb: FormBuilder, protected appService: AppService) { }

  ngOnInit() {
    this.subscription = this.optionForm.valueChanges.pipe(
      debounceTime(500),
      distinctUntilChanged()
    ).subscribe(changes => this.appService.updateFilterOptions(changes));
  }

  ngOnDestroy() {
    if (this.subscription != null) {
      this.subscription.unsubscribe();
    }
  }
}
