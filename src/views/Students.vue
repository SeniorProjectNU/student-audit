<template>
  <v-container
    id="regular-tables"
    fluid
    tag="section"
  >

    <base-material-card
      icon="mdi-clipboard-text"
      dark
      title="Students"
      class="px-5 py-3"
    >
      <v-simple-table selectable>
        <thead>
          <tr>
            <th><input type="checkbox" @click="selectAll" v-model="selectedStudents"/>
            <label></label></th>
            <th class="primary--text" @click="sort('Name')">ID</th>
            <th class="primary--text" @click="sort('Name')">Name</th>
            <th class="primary--text" @click="sort('Major')">Major</th>
            <th class="primary--text" @click="sort('Year')">Year</th>
            <th class="primary--text" icon="mdi-account-remove">Remove</th>
          </tr>
        </thead>

        <tbody>
          <tr v-for="item in sortedStudents"
              :key="item.id"
              :item="item">
            <td><input type="checkbox" :value=item.id v-model="selectedStudents"/>
            <label></label></td>
            <td>{{item.id}}</td>
            <td> <a href='/student/'>
            </a>{{item.name}}</td>
            <td>{{item.major}}</td>
            <td>{{item.year}}</td>
            <td @click="removeStudent(item.id)" icon='mdi-account-remove'></td>
          </tr>
        </tbody>
      </v-simple-table>
      <v-row>
        <v-col>
        <button v-if='prev' @click="prevPage">Previous</button> 
        </v-col>
        <v-col
          cols="1"
        >
        <button v-if='next' @click="nextPage">Next</button>
        </v-col>
      </v-row>
    </base-material-card>
  </v-container>
</template>

<script>
export default {
  name: 'StudentsList',

  created: function() {
    this.next = ((this.currentPage*this.pageSize) < this.students.length) ? true : false;
    /*fetch('')
    .then(res => {
      this.students = res;
    })*/
  },
  data: () => ({
    currentSort: 'Name',
    currentSortDir: 'asc',
    pageSize: 20,
    currentPage: 1,
    prev: false,
    next: true,
    selectedStudents: [],
    students: [
      {
        id: 201687073,
        name: 'Aizhan Uristembek',
        major: 'Computer Science',
        year: 2020,
      },
      {
        id: 201514864,
        name: 'Ivan Ivanov',
        major: 'Computer Science',
        year: 2021,
      },
      {
        id: 201743154,
        name: 'Karina Smith',
        major: 'Computer Science',
        year: 2022,
      },
      {
        id: 201623785,
        name: 'Elizabeth Turner',
        major: 'Computer Science',
        year: 2021,
      },
    ]
  }),
  methods: {
    sort:function(col) {
      if(this.currentSort == col){
        this.currentSortDir = this.currentSortDir === 'asc' ? 'desc' : 'asc';
      }else{
        this.currentSort = col;
      }
      console.log(this.currentSort, this.currentSortDir)
    },
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

// P.S. sorting doesn't work, have to work on it
// TODO: add 3 buttons and functionalities
// TODO: add remove icon and functionality
// TODO: add link to student profile to name
</script>