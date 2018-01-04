import { Component, OnInit } from '@angular/core';
import { ConfigService } from '../services/config.service';
import { IProgram } from '../models/IProgram';
import * as _ from 'lodash';
import { Program } from '../models/Program';

@Component({
  selector: 'app-config-editor',
  templateUrl: './config-editor.component.html',
  styleUrls: ['./config-editor.component.scss']
})
export class ConfigEditorComponent implements OnInit {

  displayDialog: boolean;

  program: Program;

  selectedProgram: Program;

  newCar: boolean;

  programs: Program[];

  constructor(private configService: ConfigService) { }

  ngOnInit() {
    this.configRefresh();
  }

  public configRefresh() {
    
    this.configService.getConfig().subscribe(config => {
      let programs = [];
      config.programs.forEach(p => {
        let program: Program = new Program(
          p.id,
          p.name,
          p.path,
          p.langs,
          p.versions,
          p.categories,
          p.keywords
        );
        programs.push(program);
      });
      this.programs = programs;
      console.log("this.programs", this.programs);
    });
  }

  showDialogToAdd() {
    this.newCar = true;
    this.program = new Program(null,
       "",
       "",
       [],
       [],
       [],
       []);
    this.displayDialog = true;
  }

  save() {
    let programs = [...this.programs];
    if (this.newCar)
      programs.push(this.program);
    else
      programs[this.findSelectedCarIndex()] = this.program;

    this.programs = programs;
    this.program = null;
    this.displayDialog = false;
  }

  delete() {
    let index = this.findSelectedCarIndex();
    this.programs = this.programs.filter((val, i) => i != index);
    this.program = null;
    this.displayDialog = false;
  }

  onRowSelect(event) {
    this.newCar = false;
    this.program = this.cloneProgram(event.data);
    this.displayDialog = true;
  }

  cloneProgram(p: Program): Program {
    return _.cloneDeep(p);
  }

  findSelectedCarIndex(): number {
    return this.programs.indexOf(this.selectedProgram);
  }
}

