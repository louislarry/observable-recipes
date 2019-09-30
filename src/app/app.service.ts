import { Injectable } from '@angular/core';
import { tap, map, filter, last, switchMap, concatMap, catchError } from 'rxjs/operators';
import { BehaviorSubject, Observable, from, EMPTY } from 'rxjs';
import { sampleRecipes } from './sampledata';

export interface Recipe {
  id: string;
  isDisabled: boolean;
  name: string;
}

export interface FilterOptions {
  searchFilter: string;
  hideDisabledRecipes: boolean;
}

@Injectable()
export class AppService {
  private _allRecipes$ = new BehaviorSubject<Recipe[]>([]);
  readonly allRecipes$ = this._allRecipes$.asObservable();
  filteredRecipes$ = this.allRecipes$;

  constructor() {
    this._allRecipes$.next(sampleRecipes);
  }

  updateFilterOptions(options: FilterOptions) {
    this.filteredRecipes$ = this.allRecipes$.pipe(
      this.disableFilter(options.hideDisabledRecipes),
      this.searchFilter(options.searchFilter)
    );
  }

  disableFilter(hide: boolean) {
    return map((rs: Recipe[]) => hide ? rs.filter(r => !r.isDisabled) : [...rs])
  }

  searchFilter(f: string) {
    const regex = new RegExp(`${f}`)
    return map((rs: Recipe[]) => rs.filter(r => r.name.match(regex)))
  }
}