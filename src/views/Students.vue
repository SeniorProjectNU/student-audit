<template>
  <v-container
    id="regular-tables"
    fluid
    tag="section"
  >
  <v-row>
    <v-col
      cols="3">
      <v-dialog v-model="addFiles">
          <template v-slot:activator="{ on, attrs }">
            <v-btn
              v-bind="attrs"
              v-on="on"
              color="success">
              Add student transcript
            </v-btn>
          </template>
          <v-card>
            <v-card-title class="display-3">
              Add transcripts
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
    </v-col>
    <v-spacer/>
    <v-col
      cols="2">
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
  </v-row>

    <base-material-card
      icon="mdi-clipboard-text"
      dark
      title="Students list"
      class="px-5 py-3"
    >
      <v-simple-table selectable>
        <thead>
          <tr>
            <th><input type="checkbox" @click="selectAll" v-model="selectedStudents"/>
            <label></label></th>
            <th class="display-1" @click="sort('id')">ID</th>
            <th class="display-1" @click="sort('name')">Name</th>
            <th class="display-1" @click="sort('major')">Major</th>
            <th class="display-1" @click="sort('year')">Year</th>
            <th class="display-1">Remove</th>
          </tr>
        </thead>

        <tbody>
          <tr v-for="item in sortedStudents"
              :key="item.id"
              :item="item">
            <td><input type="checkbox" :value=item.id v-model="selectedStudents"/>
            <label></label></td>
            <td>{{item.id}}</td>
            <td> <router-link tag="button" :to="{ name: 'Student Audit', params: { id: item.id } }">
            {{item.name}}</router-link></td>
            <td>{{item.major}}</td>
            <td>{{item.year}}</td>
            <td>
              <v-icon @click="removeStudent(item.id)">mdi-account-remove</v-icon>
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
        <v-dialog v-if="selectedStudents.length>0" v-model="send">
          <template v-slot:activator="{ on, attrs }">
            <v-btn
              v-bind="attrs"
              v-on="on"
              color="success"
              @click="showMails()">
              Send mails
            </v-btn>
          </template>
          <v-card>
            <v-card-title class="display-3">
              Mails list
            </v-card-title>

            <v-card-text>
              {{mails}}
            </v-card-text>

            <v-divider></v-divider>

            <v-card-actions>
              <v-spacer></v-spacer>
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
  </v-container>
</template>

<script>
export default {
  name: 'StudentsList',

  created: function() {
    this.next = ((this.currentPage*this.pageSize) < this.students.length) ? true : false;
    // TODO: get data from backend
  },
  data: () => ({
    currentSort: 'Name',
    currentSortDir: 1,
    pageSize: 10,
    pageSizeOptions: [5, 10, 15, 20, 25, 30],
    currentPage: 1,
    prev: false,
    next: true,
    send: false,
    files: [],
    addFiles: false,
    mails: '',
    selectedStudents: [],
    // TODO: delete dummy variables
    students: [
      {
        id: 201687073,
        name: 'Aizhan Uristembek',
        major: 'Computer Science',
        year: 2020,
        mail: 'aizhan.uristembek@nu.edu.kz',
      },
      {
        id: 201514864,
        name: 'Ivan Ivanov',
        major: 'Computer Science',
        year: 2021,
        mail: 'ivan',
      },
      {
        id: 201743154,
        name: 'Karina Smith',
        major: 'Computer Science',
        year: 2022,
        mail: 'karina',
      },
      {
        id: 201623785,
        name: 'Elizabeth Turner',
        major: 'Computer Science',
        year: 2021,
        mail: 'liz',
      },
    ]
  }),
  methods: {
    // sorting
    sort: function ( col ) {
      if(this.currentSort === col){
        this.currentSortDir = this.currentSortDir === 1 ? -1 : 1;
      }else{
        this.currentSort = col;
      }
    },
    // navigation
    nextPage:function() {
      if((this.currentPage*this.pageSize) < this.students.length)
        this.currentPage++;
      this.next = ((this.currentPage*this.pageSize) < this.students.length) ? true : false;
      this.prev = (this.currentPage == 1) ? false : true;
    },
    prevPage:function() {
      if(this.currentPage > 1)
        this.currentPage--;
      this.next = ((this.currentPage*this.pageSize) < this.students.length) ? true : false;
      this.prev = (this.currentPage == 1) ? false : true;
    },
    // selection
    selection: function( id ) {
      if( this.selectedStudents.includes( id ) ) {
        this.selectedStudents.splice( this.selectedStudents.indexOf( id ), 1 )
      } else {
        this.selectedStudents.push( id )
      }
    },
    containsAll: function() {
      let count = 0;
      for( var i = 0; i < this.students.length; i ++ ) {
        if( this.selectedStudents.includes( this.students[ i ].id ) ) {
          count ++;
        }
      }
      return this.students.length == count;
    },
    selectAll: function( ) {
      if( !this.containsAll() ) {
        this.selectedStudents = []
        for( var i = 0; i < this.students.length; i ++ ) {
          this.selectedStudents.push( this.students[ i ].id )
        }
      } else {
        this.selectedStudents = [];
      }
    },
    // addition
    submitFiles: function() {
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
    showMails: function( ) {
      for( var i = 0; i < this.selectedStudents.length; i ++ ) {
        this.mails += this.students.find(s => s.id === this.selectedStudents[ i ] ).mail
        this.mails += ', '
      }
    },
    // remove
    removeStudent: function( id ) {
      // TODO: send id and command to backend
      var student = this.students.find(s => s.id === id )
      this.students.splice( this.students.indexOf( student ), 1 )
    },
  },
  computed: {
    sortedStudents: function() {
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
    pageSize: function() {
      this.next = ((this.currentPage*this.pageSize) < this.students.length) ? true : false;
      this.prev = (this.currentPage == 1) ? false : true;
    },
  },
}
</script>