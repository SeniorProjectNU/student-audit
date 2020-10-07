<template>
  <v-container
    id="regular-tables"
    fluid
    tag="section"
  >
  <v-row>
    <v-spacer />
    <v-col
      cols="3">
      <v-btn
        color="success"
        @click="addTranscripts()"
      >
        Add student transcript
      </v-btn>
    </v-col>
  </v-row>

    <base-material-card
      icon="mdi-clipboard-text"
      dark
      title="Students list"
      class="px-5 py-3"
    >
    <v-row>
    <v-spacer />
    <v-col
      cols="2">
      <v-select v-model="pageSize"
        :items ="pageSizeOptions"
        append-outer-icon="mdi-list"
        menu-props="auto"
        hide-details
        :label="pageSize"
        single-line
      >
      </v-select>
    </v-col>
  </v-row>
      <v-simple-table selectable>
        <thead>
          <tr>
            <th><input type="checkbox" @click="selectAll" v-model="selectedStudents"/>
            <label></label></th>
            <th class="headline" @click="sort('Name')">ID</th>
            <th class="headline" @click="sort('Name')">Name</th>
            <th class="headline" @click="sort('Major')">Major</th>
            <th class="headline" @click="sort('Year')">Year</th>
            <th class="headline" icon="mdi-account-remove">Remove</th>
          </tr>
        </thead>

        <tbody>
          <tr v-for="item in sortedStudents"
              :key="item.id"
              :item="item">
            <td><input type="checkbox" :value=item.id v-model="selectedStudents"/>
            <label></label></td>
            <td>{{item.id}}</td>
            <td> <router-link tag="headline" :to="{ name: 'Student Audit', params: { id: item.id } }">
            {{item.name}}</router-link></td>
            <td>{{item.major}}</td>
            <td>{{item.year}}</td>
            <td>
              <v-btn @click="removeStudent(item.id)">
                <v-icon>mdi-account-remove</v-icon>
              </v-btn>
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
        <v-dialog v-if="selectedStudents.length>0" v-model="dialog">
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
                @click="dialog = false, mails = ''"
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
        <v-btn v-if="selectedStudents.length>1" color="success">
          <router-link tag="display-2" :to="{ name: 'Compare Students', query: { id: selectedStudents } }" >
            Compare
          </router-link>
        </v-btn>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  name: 'StudentsList',

  created: function() {
    this.next = ((this.currentPage*this.pageSize) < this.students.length) ? true : false;
    // TODO: fetch data from backend
    /*fetch('')
    .then(res => {
      this.students = res;
    })*/
  },
  data: () => ({
    currentSort: 'Name',
    currentSortDir: 'asc',
    pageSize: 10,
    pageSizeOptions: [5, 10, 15, 20, 25, 30],
    currentPage: 1,
    prev: false,
    next: true,
    dialog: false,
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
    sort:function(col) {
      if(this.currentSort == col){
        this.currentSortDir = this.currentSortDir === 'asc' ? 'desc' : 'asc';
      }else{
        this.currentSort = col;
      }
      console.log(this.currentSort, this.currentSortDir)
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
      this.prev = (this.currentPage == 1) ? false : true;
      this.next = ((this.currentPage*this.pageSize) < this.students.length) ? true : false;
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
        for( var i = 0; i < this.students.length; i ++ ) {
          this.selectedStudents.push( this.students[ i ].id )
        }
      } else {
        this.selectedStudents = [];
      }
    },
    // addition
    addTranscript: function( ) {

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
      this.students.indexOf( id )
    },
  },
  computed: {
    sortedStudents: function() {
      return this.students.slice(0).sort((a,b) => {
        let modifier = 1;
        if(this.currentSortDir === 'desc') modifier = -1;
        if(a[this.currentSort] < b[this.currentSort]) return -1 * modifier;
        if(a[this.currentSort] > b[this.currentSort]) return 1 * modifier;
        return 0;
      }).filter((row, index) => {
        let start = (this.currentPage-1)*this.pageSize;
        let end = this.currentPage*this.pageSize;
        if(index >= start && index < end) return true;
      });
    },
  },
}

// TODO: sorting doesn't work, have to work on it
// TODO: add button and functionality: add
</script>