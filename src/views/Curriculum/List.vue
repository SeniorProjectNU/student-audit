<template>
    <v-container
            id="regular-tables"
            fluid
            tag="section"
    >
        <base-material-card
                icon="mdi-clipboard-text"
                title="Curriculum List"
                class="px-5 py-3"
        >
            <v-simple-table>
                <thead>
                <tr>
                    <th class="primary--text display-1">
                        Major
                    </th>
                    <th class="primary--text display-1">
                        Year
                    </th>
                    <th></th>

                </tr>
                </thead>

                <tbody>
                <tr v-for="(plan, index) in curriculums" :key="index" >
                    <td>{{plan.major}}</td>
                    <td>{{plan.year}}</td>
                    <td class="text-right">
                        <v-tooltip open-delay="83" bottom>
                            <template v-slot:activator="{ on, attrs }">
                                <v-icon
                                        v-bind="attrs"
                                        v-on="on"
                                        class="mx-1">
                                    mdi-pencil
                                </v-icon>
                            </template>
                            <span>Edit</span>
                        </v-tooltip>
                        <v-tooltip open-delay="83" bottom>
                            <template v-slot:activator="{ on, attrs }">
                                <v-icon
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
        </base-material-card>

<!--        <div class="py-3" />-->
    </v-container>
</template>

<script>
    export default {

      data () {
        return {
          curriculums: [],
        }
      },

      methods: {
        getCurriculums() {
          let _this = this;

          _this.curriculums = [
            {
              major: 'Computer Science',
              year: 2012
            },
            {
              major: 'Computer Science',
              year: 2012
            },
            {
              major: 'Computer Science',
              year: 2012
            },
            {
              major: 'Computer Science',
              year: 2012
            },
            {
              major: 'Computer Science',
              year: 2012
            },
            {
              major: 'Computer Science',
              year: 2012
            },
            {
              major: 'Computer Science',
              year: 2012
            },
            {
              major: 'Computer Science',
              year: 2012
            },
            {
              major: 'Computer Science',
              year: 2012
            },
            {
              major: 'Computer Science',
              year: 2012
            },
            {
              major: 'Computer Science',
              year: 2012
            },
            {
              major: 'Computer Science',
              year: 2012
            }
          ]
        }
      },

      created() {
        this.getCurriculums();
      }
    }
</script>
