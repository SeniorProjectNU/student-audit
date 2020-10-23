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
                <router-link :to="{ name: 'Curriculum', query: { action: 'create' } }">
                    <v-btn
                        color="success">
                        {{$t('curriculum.add')}}
                    </v-btn>
                </router-link>
            </v-col>
        </v-row>
        <base-material-card
                icon="mdi-calendar-multiple"
                :title="$t('curriculum.list')"
                class="px-5 py-3"
        >
            <v-simple-table>
                <thead>
                <tr>
                    <th>
                        <input class="mr-3" type="checkbox" @click="selectAll" v-model="allSelected"/>
                    </th>
                    <th class="primary--text display-1">
                        {{$t('major')}}
                    </th>
                    <th class="primary--text display-1">
                        {{$t('year')}}
                    </th>
                    <th></th>

                </tr>
                </thead>

                <tbody>
                <tr class="cursor-pointer" v-for="(plan, index) in curriculums" :key="index" >
                    <td><input @click.stop="" type="checkbox" :value=plan.id v-model="selectedCurriculums"/>
                    <td>{{plan.major}}</td>
                    <td>{{plan.year}}</td>
                    <td class="text-right">
                        <router-link tag="button" :to="{ name: 'Curriculum', query: { action: 'edit' }, params: {id: plan.id} }">
                            <v-tooltip open-delay="83" bottom>
                                <template v-slot:activator="{ on, attrs }">
                                    <v-icon
                                            @click.stop=""
                                            v-bind="attrs"
                                            v-on="on"
                                            class="mx-1">
                                        mdi-pencil
                                    </v-icon>
                                </template>
                                <span>{{$t('edit')}}</span>
                            </v-tooltip>
                        </router-link>
                        <v-tooltip open-delay="83" bottom>
                            <template v-slot:activator="{ on, attrs }">
                                <v-icon
                                        @click.stop="deleteModal([plan.id])"
                                        v-bind="attrs"
                                        v-on="on"
                                        color="error"
                                        class="mx-1">
                                    mdi-delete
                                </v-icon>
                            </template>
                            <span>{{$t('delete')}}</span>
                        </v-tooltip>
                    </td>
                </tr>
                </tbody>
            </v-simple-table>
        </base-material-card>
        <DeleteModal disabled ref="delete" :number="selectedToDelete.length" @submit="deleteCurriculum(selectedToDelete)"></DeleteModal>
    </v-container>
</template>

<script>
    import { get } from '../../helpers/api'

    import DeleteModal from '../common/modal/DeleteModal.vue'

    export default {
      components: {
        DeleteModal
      },

      data () {
        return {
          curriculums: [],
          selectedCurriculums: [],
          selectedToDelete: [],
          allSelected: false,
          pageSize: 10,
          pageSizeOptions: [5, 10, 15, 20, 25, 30],
        }
      },

      methods: {
        getCurriculums() {
          let _this = this;

          get(_this, '/curriculum', '', response=>{
            _this.curriculums = response.data;
          })
        },
        deleteModal(ids){
          this.selectedToDelete = ids;
          this.$refs.delete.showModal();
        },
        deleteCurriculum(ids){
          this.$refs.delete.closeModal()
        },
        selectAll() {
          this.selectedCurriculums = [];
          if (!this.allSelected){
            this.allSelected = true;
            this.curriculums.forEach(x => this.selectedCurriculums.push(x.id))
          } else
            this.allSelected = false
        }
      },

      created() {
        this.getCurriculums();
      },

      watch: {
        selectedCurriculums(val) {
          this.allSelected = val.length === this.curriculums.length
        }
      }
    }
</script>
