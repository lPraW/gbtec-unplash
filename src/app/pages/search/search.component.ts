import { Component } from '@angular/core';
import { UnplashService } from '../../services/unplash/unplash.service';
import { debounceTime } from 'rxjs/operators';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ViewComponent } from '../view/view.component';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrl: './search.component.scss'
})
export class SearchComponent {

  searchForm: FormGroup;
  images: any[] = [];
  loading: boolean = false;
  page: number = 1;
  totalImages: number = 0;

  constructor(
    private unplashService: UnplashService,
    private formBuilder: FormBuilder,
    private dialog: MatDialog
  ) {
    this.searchForm = this.formBuilder.group({
      query: ['']
    });
  }

  ngOnInit(): void {
    this.searchForm.get('query')?.valueChanges
      .pipe(debounceTime(300))
      .subscribe(query => {
        this.page = 1;
        this.onSearch(query);
      });
  }

  get queryControl(): FormControl {
    return this.searchForm.get('query') as FormControl;
  }

  onSearch(query: string): void {
    if (!query) {
      this.images = [];
      this.totalImages = 0;
      return;
    }

    this.loading = true;
    this.images = [];


    this.unplashService.searchPhotos(query, this.page).subscribe({
      next: (response) => {
        this.images = response.results;
        this.totalImages = response.total;
        this.loading = false;
      },
      error: (err) => {
        console.error(err);
        this.loading = false;
      }
    });
  }

  onPageChange(newPage: number): void {
    this.page = newPage;
    this.onSearch(this.searchForm.get('query')?.value);
  }

  openImageView(imageUrl: string): void {
    const dialogRef = this.dialog.open(ViewComponent, {
      data: { imageUrl }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The modal was closed');
    });
  }

}
