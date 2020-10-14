<template>
  <v-container
    id="regular-tables"
    fluid
    tag="section"
  >
  <v-row justify="space-between">
    <v-col cols="6" md="2">
      <v-select v-model="pageSize"
        :items ="pageSizeOptions"
        prepend-icon="mdi-format-align-justify"
        menu-props="auto"
        hide-details
        label="pageSize"
        single-line
      >
      </v-select>
    </v-col>
    <v-spacer/>
    <v-col cols="6" md="2">
        <v-btn
          color="success"
          @click="addFiles=true">
          Add transcript
        </v-btn>
    </v-col>
  </v-row>

    <base-material-card
      icon="mdi-account-group"
      title="Student list"
      class="px-5 py-3"
    >
      <v-simple-table>
        <thead>
          <tr>
            <th><input class="mr-3" type="checkbox" @click="selectAll" v-model="allSelected"/></th>
            <th class="primary--text display-1" @click="sort('id')">ID</th>
            <th class="primary--text display-1" @click="sort('name')">Name</th>
            <th class="primary--text display-1" @click="sort('GPA')">cGPA</th>
            <th class="primary--text display-1" @click="sort('major')">Major</th>
            <th class="primary--text display-1" @click="sort('year')">Year</th>
            <th></th>
          </tr>
        </thead>

        <tbody>
          <tr v-for="(student) in sortedStudents"
              :key="student.id">
            <td><input type="checkbox" :value=student.id v-model="selectedStudents"/></td>
            <td>{{student.id}}</td>
            <td> <router-link tag="button" :to="{ name: 'Student Audit', params: { id: student.id } }">
            {{student.name}}</router-link></td>
            <td>{{student.GPA}}</td>
            <td>{{student.major}}</td>
            <td>{{student.year}}</td>
            <td class="text-right">
              <v-tooltip open-delay="83" bottom>
                <template v-slot:activator="{ on, attrs }">
                  <v-icon
                    @click="removeStudent(student.id)"
                    v-bind="attrs"
                    v-on="on"
                    color="error"
                    class="mx-1">
                    mdi-delete
                  </v-icon>
                </template>
                <span>Delete</span>
              </v-tooltip>
            </td>
          </tr>
        </tbody>
      </v-simple-table>
      <v-row>
        <v-col>
        <v-btn color="success" v-if='prev' @click="prevPage">Previous</v-btn> 
        </v-col>
        <v-col
          cols="1"
        >
        <v-btn color="success" v-if='next' @click="nextPage">Next</v-btn>
        </v-col>
      </v-row>
    </base-material-card>
    <v-row>
      <v-col
        cols="2">
        <v-btn
          v-if="selectedStudents.length>0"
          color="success"
          @click="send=true, showMails()">
          Send mails
        </v-btn>
      </v-col>
      <v-spacer/>
      <v-col
        cols="2">
        <router-link v-if="selectedStudents.length>1"
          :to="{ name: 'Compare Students', query: { id: selectedStudents } }" >
          <v-btn  color="success">
              Compare
          </v-btn>
        </router-link>
      </v-col>
    </v-row>
    <v-dialog
      v-model="addFiles"
      max-width="600">
      <v-card>
        <v-card-title class="primary--text display-2">
          Add transcripts
        <v-spacer />
      
        <v-icon
          aria-label="Close"
          @click="addFiles = false"
        >
          mdi-close
        </v-icon>
        </v-card-title>

        <v-card-text>
          <v-file-input
            v-model="files"
            multiple
            show-size
            counter
            placeholder="Select transcripts"
            prepend-icon="mdi-paperclip"
            outlined
            accept=".pdf"
          >
          <template v-slot:selection="{ index, text }">
            <v-chip
              v-if="index < 2"
              dark
              label
              small
            >
              {{ text }}
            </v-chip>

            <span
              v-else-if="index === 2"
            >
              +{{ files.length - 2 }} File(s)
            </span>
          </template>
          </v-file-input>
        </v-card-text>

        <v-divider></v-divider>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            color="primary"
            text
            @click="addFiles = false, submitFiles()"
          >
            Ok
          </v-btn>
          <v-btn
            color="primary"
            text
            @click="addFiles = false"
          >
            Close
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog
      v-model="send"
      max-width="600">
      <v-card>
        <v-card-title class="primary--text display-2">
          Mails list

        <v-spacer />
          
        <v-icon
          aria-label="Close"
          @click="send=false, mails=''"
        >
          mdi-close
        </v-icon>
        </v-card-title>
        <v-card-text v-model="mails" id="tocopy">
          {{mails}}
        </v-card-text>

        <v-divider></v-divider>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            color="primary"
            text
            @click="copyMails()"
          >
            Copy to clipboard
          </v-btn>
          <v-btn
            color="primary"
            text
            @click="send = false, mails = ''"
          >
            Close
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
export default {
  name: 'StudentsList',

  data: () => ({
    currentSort: 'Name',
    currentSortDir: 1,
    pageSize: 10,
    pageSizeOptions: [2, 5, 10, 15, 20, 25, 30],
    currentPage: 1,
    prev: false,
    next: true,
    send: false,
    files: [],
    addFiles: false,
    mails: '',
    selectedStudents: [],
    allSelected: false,
    students: []
  }),
  
  computed: {
    sortedStudents() {
      return this.students.slice().sort((a,b) => {
        if(a[this.currentSort] < b[this.currentSort]) return -1 * this.currentSortDir;
        if(a[this.currentSort] > b[this.currentSort]) return this.currentSortDir;
        return 0;
      }).filter((row, index) => {
        let start = (this.currentPage-1)*this.pageSize;
        let end = this.currentPage*this.pageSize;
        if(index >= start && index < end) return true;
      });
    },
  },

  watch: {
    pageSize() {
      this.next = ((this.currentPage*this.pageSize) < this.students.length) ? true : false;
      this.prev = (this.currentPage == 1) ? false : true;
    },
    currentPage() {
      this.next = ((this.currentPage*this.pageSize) < this.students.length) ? true : false;
      this.prev = (this.currentPage == 1) ? false : true;
    },
    selectedStudents(val) {
      this.allSelected = val.length === this.students.length
    }
  },

  methods: {
    // get information
    getStudents() {
      // TODO: get data from backend
      this.students = [
      {
        id: 201687073,
        name: 'Aizhan Uristembek',
        major: 'Computer Science',
        year: 2020,
        mail: 'aizhan.uristembek@nu.edu.kz',
        GPA: 3.50.toFixed(2),
      },
      {
        id: 201514864,
        name: 'Ivan Ivanov',
        major: 'Computer Science',
        year: 2021,
        mail: 'ivan@gmail.com',
        GPA: 4.00.toFixed(2),
      },
      {
        id: 201743154,
        name: 'Karina Smith',
        major: 'Computer Science',
        year: 2022,
        mail: 'karina@gmail.com',
        GPA: 3.99,
      },
      {
        id: 201623785,
        name: 'Elizabeth Turner',
        major: 'Computer Science',
        year: 2021,
        mail: 'liz@gmail.com',
        GPA: 2.57,
      },
    ]
    },
    // sorting
    sort ( col ) {
      if(this.currentSort === col){
        this.currentSortDir = -1 * this.currentSortDir;
      }else{
        this.currentSort = col;
      }
    },
    // navigation
    nextPage() {
      if((this.currentPage*this.pageSize) < this.students.length)
        this.currentPage++;
    },
    prevPage() {
      if(this.currentPage > 1)
        this.currentPage--;
    },
    // selection
    selectAll( ) {
      this.selectedStudents = []
      if( !this.allSelected ) {
        this.allSelected = true
        this.students.forEach(x => this.selectedStudents.push(x.id))
      } else {
        this.allSelected = false
      }
    },
    // transcript addition
    submitFiles() {
      if ( this.files.length != 0 ) {
        let formData = new FormData();
        formData.append('transcripts', JSON.stringify( this.files ) );
        // TODO: send to back
        /*axios.post("/",
          formData, 
          {
            headers: {
              'Content-Type': 'multipart/form-data'
            }
          }
          ).then(response => {
            console.log("Success!");
            console.log({ response });
          })
          .catch(error => {
            console.log({ error });
          });*/
      } else {
        console.log("there are no files.");
      }
      this.files = []
    },
    // mails
    showMails( ) {
      for( var i = 0; i < this.selectedStudents.length; i ++ ) {
        this.mails += this.students.find(s => s.id === this.selectedStudents[ i ] ).mail
        this.mails += ', '
      }
    },
    copyMails() {
      navigator.clipboard.writeText(this.mails);
    },
    // remove
    removeStudent( id ) {
      // TODO: send id and command to backend
      var student = this.students.find(s => s.id === id )
      this.students.splice( this.students.indexOf( student ), 1 )
    },
  },

  created() {
    this.getStudents();
    this.next = ((this.currentPage*this.pageSize) < this.students.length) ? true : false;
  },
}
</script>