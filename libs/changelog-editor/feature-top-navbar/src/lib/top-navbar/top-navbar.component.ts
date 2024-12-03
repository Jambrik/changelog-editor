import { Component, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ConfigHelper } from '@changelog-editor/util/helpers';
import { Program } from '@changelog-editor/util/models';
import { ConfigService, ActualService, ChangeLogService } from '@changelog-editor/data-access-core';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/switchMap';


@Component({
  selector: 'app-top-navbar',
  templateUrl: './top-navbar.component.html',
  styleUrls: ['./top-navbar.component.scss'],
  standalone: true,
  imports: [RouterLink, TranslateModule],
  providers: [ConfigService, ActualService, ChangeLogService]
})
export class TopNavbarComponent implements OnInit, OnChanges {
  public filterText: string;
  public programs: Program[];
  public searchTerm$ = new Subject<string>();
  constructor(
    private configService: ConfigService,
    public actualService: ActualService,
    private translate: TranslateService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    translate.setDefaultLang('hu');
    translate.use('hu');
  }

  ngOnInit() {
    this.route.queryParams.subscribe(queryParams => {
      const lang = queryParams['lang'];
      console.log('languae from top navbar:', lang);
      this.translate.use(lang);
      const filter = queryParams['filter'];
      if (filter) {
        if ((this.filterText === '')) {
          this.filterText = filter;
        }

      } else {
        this.filterText = '';
      }
      this.actualService.actualFilter = filter;
    });
    this.configService.getConfig().subscribe(
      (data) => {
        console.log('program list', data);
        this.programs = data.programs;

      },
      (error) => {
        console.log('error', error);
      }
    );

    this.search(this.searchTerm$)
      .subscribe();
  }

  ngOnChanges(changes: SimpleChanges) {

  }

  search(terms: Observable<string>) {
    return terms.debounceTime(300)
      .distinctUntilChanged()
      .switchMap(term => {
        return this.router.navigate(this.route.snapshot.url, {
          queryParams: {
            lang: this.getActualLang(),
            filter: term
          }
        });
      });
  }


  public openProgram(program: Program) {
    this.actualService.actualProgram = program;

  }

  public get actualProgram(): string {
    if (this.actualService.actualProgram) {
      return this.actualService.actualProgram.name;
    } else {
      return '';
    }
  }

  public getLastVersionNumber(program: Program): string {
    if (program.versions && (program.versions.length > 0)) {
      program.versions.sort(ConfigHelper.versionSorter);
      return program.versions[0].version;
    } else {
      return 'last';
    }

  }

  public isSelected(lang: string): boolean {
    return this.translate.currentLang === lang;
  }

  public changeLang(event: Event, lang: string) {
    event.preventDefault();
    this.router.navigate(this.route.snapshot.url, {
      queryParams: {
        lang: lang,
        filter: this.filterText
      }
    });
  }

  public getActualLang(): string {
    return this.translate.currentLang;
  }

  public get action(): string {
    return this.actualService.actualAction;
  }

  public apply(event: Event) {
    event.preventDefault();
    console.log('apply');
    this.router.navigate(this.route.snapshot.url, {
      queryParams: {
        lang: this.getActualLang(),
        filter: this.filterText
      }
    });
  }

  public getUserName(): string {
    if (this.actualService.actualUser) {
      return this.actualService.actualUser.name;
    }
  }

  public getUserCode(): string {
    if (this.actualService.actualUser) {
      return this.actualService.actualUser.code;
    }
  }

}
