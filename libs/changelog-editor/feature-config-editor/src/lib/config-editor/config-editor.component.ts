import { Component, Inject, OnInit } from '@angular/core';
import { cloneDeep } from 'lodash';
import { DialogModule } from '@progress/kendo-angular-dialog';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { GridModule } from '@progress/kendo-angular-grid';
import { ProgramImpl } from '@changelog-editor/util/models';
import { ConfigService, ActualService, ChangeLogService } from '@changelog-editor/data-access-core';

@Component({
  selector: 'app-config-editor',
  templateUrl: './config-editor.component.html',
  styleUrls: ['./config-editor.component.scss'],
  standalone: true,
  imports: [
    DialogModule,
    FormsModule,
    TranslateModule,
    GridModule
  ],
  providers: [ConfigService, ActualService, ChangeLogService]
})
export class ConfigEditorComponent implements OnInit {

  displayDialog: boolean;

  program: ProgramImpl;

  selectedProgram: ProgramImpl;

  newCar: boolean;

  programs: ProgramImpl[];

  cols: any[];

  constructor(@Inject(ConfigService) private configService: ConfigService) { }

  ngOnInit() {
    this.configRefresh();
    this.getCols();
  }

  public configRefresh() {

    this.configService.getConfig().subscribe(config => {
      const programs = [];
      config.programs.forEach(p => {
        const program: ProgramImpl = new ProgramImpl(
          p.id,
          p.name,
          p.path,
          p.langs,
          p.versions,
          p.tagInfos
        );
        programs.push(program);
      });
      this.programs = programs;
      console.log('this.programs', this.programs);
    });
  }

  public getCols() {
    this.cols = [
      { field: 'id', header: 'ID' },
      { field: 'name', header: 'NAME' },
      { field: 'path', header: 'PATH' },
      { field: 'langs', header: 'LANG_LIST' },
    ];
  }

  showDialogToAdd() {
    this.newCar = true;
    this.program = new ProgramImpl(null,
      '',
      '',
      [],
      [],
      []);
    this.displayDialog = true;
  }

  save() {
    const programs = [...this.programs];
    if (this.newCar) {
      programs.push(this.program);
    } else {
      programs[this.findSelectedCarIndex()] = this.program;
    }

    this.programs = programs;
    this.program = null;
    this.displayDialog = false;
  }

  delete() {
    const index = this.findSelectedCarIndex();
    this.programs = this.programs.filter((val, i) => i !== index);
    this.program = null;
    this.displayDialog = false;
  }

  onRowSelect(event) {
    this.newCar = false;
    this.program = this.cloneProgram(event.data);
    this.displayDialog = true;
  }

  cloneProgram(p: ProgramImpl): ProgramImpl {
    return cloneDeep(p);
  }

  findSelectedCarIndex(): number {
    return this.programs.indexOf(this.selectedProgram);
  }
}

