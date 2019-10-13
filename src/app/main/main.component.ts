import {Component, OnInit} from '@angular/core';
import {User} from "../user";
import {QuestComp} from "../quest";
import {FormArray, FormControl} from "@angular/forms";
import {CdkDragDrop, moveItemInArray, transferArrayItem} from "@angular/cdk/drag-drop";
import {HttpClient, HttpHeaders} from "@angular/common/http";

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})


export class MainComponent implements OnInit {
  //TODO: checkers, when translate add all:completed
  user: User;
  startQuestComp: metaAndFormControl[] = [//code
    {type: "id", desc: "1", form: null},
    {type: "string", desc: "Task name: ", form: new FormControl('start quest')},
    {type: "string", desc: "Description: ", form: new FormControl('desc')},
    {type: "bool", desc: "QR Code: ", form: new FormControl(true)}
  ];
  endQuestComp: metaAndFormControl[] = [ //code
    {type: "id", desc: "2", form: null},
    {type: "string", desc: "Task name: ", form: new FormControl('end quest')},
    {type: "string", desc: "Description: ", form: new FormControl('desc')},
    {type: "bool", desc: "QR Code: ", form: new FormControl(true)}
  ];
  infoQuestComp: metaAndFormControl[] = [
    {type: "id", desc: "3", form: null},
    {type: "string", desc: "Task name: ", form: new FormControl('info quest')},
    {type: "string", desc: "Description: ", form: new FormControl('desc')}
  ];
  inputQuestComp: metaAndFormControl[] = [ //text
    {type: "id", desc: "4", form: null},
    {type: "string", desc: "Task name: ", form: new FormControl('input quest')},
    {type: "string", desc: "Description: ", form: new FormControl('desc')}
  ];
  slackQuestComp: metaAndFormControl[] = [ //text
    {type: "id", desc: "5", form: null},
    {type: "string", desc: "Task name: ", form: new FormControl('slack quest')},
    {type: "string", desc: "Description: ", form: new FormControl('desc')},
    {type: "string", desc: "URL: ", form: new FormControl('url')},
    {type: "string", desc: "Tag: ", form: new FormControl('tag')},
    {type: "string", desc: "Email: ", form: new FormControl('email')}
  ];
  githubPullRequestQuestComp: metaAndFormControl[] = [
    {type: "id", desc: "6", form: null},
    {type: "string", desc: "Task name: ", form: new FormControl('git pull quest')},
    {type: "string", desc: "Description: ", form: new FormControl('desc')},
    {type: "string", desc: "Repository name: ", form: new FormControl('url')}
  ];
  githubIssueQuestComp: metaAndFormControl[] = [
    {type: "id", desc: "7", form: null},
    {type: "string", desc: "Task name: ", form: new FormControl('git issue quest')},
    {type: "string", desc: "Description: ", form: new FormControl('desc')},
    {type: "string", desc: "Repository name: ", form: new FormControl('url')}
  ];
  githubCommitQuestComp: metaAndFormControl[] = [
    {type: "id", desc: "8", form: null},
    {type: "string", desc: "Task name: ", form: new FormControl('git commit quest')},
    {type: "string", desc: "Description: ", form: new FormControl('desc')},
    {type: "string", desc: "Repository name: ", form: new FormControl('url')}
  ];
  sourceQuestCompList: metaAndFormArray[] = [
    {desc: 'Start quest', arr: this.startQuestComp},
    {desc: 'End quest', arr: this.endQuestComp},
    {desc: 'Info quest', arr: this.infoQuestComp},
    {desc: 'Input quest', arr: this.inputQuestComp},
    {desc: 'Slack quest', arr: this.slackQuestComp},
    {desc: 'Git pull quest', arr: this.githubPullRequestQuestComp},
    {desc: 'Git issue quest', arr: this.githubIssueQuestComp},
    {desc: 'Git commit quest', arr: this.githubCommitQuestComp},
  ];

  destQuestCompList: metaAndFormArray[] = [];

  updateSource() {
    this.sourceQuestCompList = [
      {desc: 'Start quest', arr: this.startQuestComp},
      {desc: 'End quest', arr: this.endQuestComp},
      {desc: 'Info quest', arr: this.infoQuestComp},
      {desc: 'Input quest', arr: this.inputQuestComp},
      {desc: 'Slack quest', arr: this.slackQuestComp},
      {desc: 'Git pull quest', arr: this.githubPullRequestQuestComp},
      {desc: 'Git issue quest', arr: this.githubIssueQuestComp},
      {desc: 'Git commit quest', arr: this.githubCommitQuestComp},
    ];
  }

  drop(event: CdkDragDrop<string[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex);
    }
    this.updateSource()
  }

  getUser(): User {
    return JSON.parse(localStorage.getItem("user"));
  }

  headers = new HttpHeaders({'Content-Type': 'application/json'});
  options = {headers: this.headers};


  chosenPlayer: User;


  setPlayer (player: User) {
    this.chosenPlayer = player;
  };

  players : User[] = [];


  playersUpdate() {
    let data = {
      user: {
        auth_token: this.getUser().token
      }
    };
    this.http.post("https://assimilite.herokuapp.com/api/players", data, this.options).subscribe(
      val => {
        console.log('post players call successful value returned in body',
          val);
        this.players = val['players'];
      },
      response => {
        console.log('post players call in error', response);
      },
      () => {
        console.log('The post players observable is now completed.');
      }
    );
  }
  modelId: number;
  submit(dataRaw: metaAndFormArray[]) {
    let th = this;

    const serverUrl = "https://assimilite.herokuapp.com/";
    let components = [];
    dataRaw.forEach(function (element, index) {
      let comp: Comp;
      let id: string;
      let desc: string;
      let title: string;
      let qrcode: boolean;
      let repo: string;
      let tag: string;
      let email: string;
      element.arr.forEach(function (el) {
        if (el.type == "id") {
          id = el.desc;
        } else {
          switch (el.desc) {
            case "Task name: " : {
              title = el.form.value;
              break;
            }
            case "Description: " : {
              desc = el.form.value;
              break;
            }
            case "QR Code: " : {
              qrcode = el.form.value;
              break;
            }
            case "Repository name: " : {
              repo = el.form.value;
              break;
            }
            case "Tag: " : {
              tag = el.form.value;
              break;
            }
            case "Email: " : {
              email = el.form.value;
              break;
            }
          }
        }

      });

      comp = {
        title: title,
        description: desc,
        type: +id,
        payload: JSON.stringify({
          repo_name: repo,
          tag: tag,
          qrcode: qrcode,
          email: email,
        })
      };
      components.push(comp);
    });

    console.log(components);
    console.log(JSON.stringify({
      user: {
        auth_token: th.getUser().token
      },
      add: {
        model: {
          title: (<HTMLInputElement>document.getElementById("main-name-input")).value,
          component: components
        }
      }
    }));


    th.http.post(`${serverUrl}api/add_model`, {
        user: {
          auth_token: th.getUser().token
        },
        add: {
          model: {
            title: (<HTMLInputElement>document.getElementById("main-name-input")).value,
            components: components
          }
        }
      },
    this.options
  )   .subscribe(
      val => {
        console.log('post module call successful value returned in body',
          val);

        this.modelId = val['model']['id'];
        let quest = {
          user: {
            auth_token: th.getUser().token
          },
          add: {
            quest: {
              model_id: this.modelId,
              player_id: this.chosenPlayer.id,
              supervisor_id: this.getUser().id,
            }
          }
        };
        th.http.post(`${serverUrl}api/add_model`, quest, this.options)
          .subscribe(
            val => {
              console.log('post quest call successful value returned in body',
                val);
            },
            response => {
              console.log('post quest call in error', response);
            },
            () => {
              console.log('The post quest observable is now completed.');
            }
          );
      },
      response => {
        console.log('post module call in error', response);
      },
      () => {
        console.log('The post module observable is now completed.');
      }
    );
}



  constructor(private http: HttpClient) {
  }

  ngOnInit() {
    this.user = this.getUser();
    console.log(JSON.stringify(this.user));
  }

}

export class metaAndFormControl {
  type: string;
  desc: string;
  form: FormControl;
}

export class metaAndFormArray {
  desc: string;
  arr: metaAndFormControl[];
}

export class Comp {
  title: string;
  description: string;
  type: number;
  payload: string;
}

