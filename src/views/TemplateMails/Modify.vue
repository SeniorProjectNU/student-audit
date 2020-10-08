<template>
  <v-container
    id="user-profile"
    fluid
    tag="section"
  >
    <v-row justify="center">
      <v-col
        cols="12"
        md="8"
      >
        <base-material-card>
          <template v-slot:heading>
            <div class="display-2 font-weight-light">
              Modify Mail Content
            </div>

            <div class="subtitle-1 font-weight-light">
              Complete your mail
            </div>
          </template>

          <v-form>
            <v-container class="py-0">
              <v-row>
                <v-col cols="12">
                  <v-text-field
                    label="Name"
                    v-model="name"
                    class="purple-input"
                  />
                </v-col>

                <v-col cols="12">
                  <v-textarea
                    class="purple-input"
                    label="Body"
                    v-model="text"
                  />
                </v-col>

                <v-col
                  class="text-right"
                >
                  <router-link
                    tag="button"
                    :disabled="!saved"
                    :to="{ name: 'Template mails' }">
                    <v-btn
                      color="success"
                      class="mr-0"
                      @click="dialog=!saved"
                    >
                      Cancel
                    </v-btn>
                  </router-link>
                </v-col>
                <v-col
                  cols="2"
                  class="text-right"
                >
                  <router-link :to="{ name: 'Template mails' }">
                    <v-btn
                      color="success"
                      class="mr-0"
                      @click="updateMailInfo()"
                    >
                      Save
                    </v-btn>
                  </router-link>
                </v-col>
              </v-row>
            </v-container>
          </v-form>
        </base-material-card>
      </v-col>
    </v-row>

    <v-dialog
      v-model="dialog"
      max-width="600"
    >
      <v-card>
        <v-card-title class="display-2">
          Are you sure?

          <v-spacer />

          <v-icon
            aria-label="Close"
            @click="dialog = false"
          >
            mdi-close
          </v-icon>
        </v-card-title>

        <v-card-text>
          You have unsaved changes. Are you sure you want to quit?
        </v-card-text>

        <v-divider></v-divider>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            color="primary"
            text
            @click="dialog = false"
          >
            No, return to modifications
          </v-btn>

          <router-link tag="text--primary" :to="{ name: 'Template mails' }">
            <v-btn
              color="primary"
              text
              @click="dialog = false"
            >
              Yes, quit
            </v-btn>
          </router-link>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
  export default {
    name: 'MailModification',

    data: () => ({
      name: '',
      text: '',
      initialName: '',
      initialText: '',
      dialog: false,
    }),
    computed: {
      saved () {
        return ( this.initialText === this.text && this.initialName === this.name );
      }
    },
    methods: {
      getMailInfo() {
        if( this.$route.params.id !== 'new' ) {
          // TODO: get data from back
          this.name = "Lorem Ipsum"
          this.text = "Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt. Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit, sed quia non numquam eius modi tempora incidunt ut labore et dolore magnam aliquam quaerat voluptatem. Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam, nisi ut aliquid ex ea commodi consequatur? Quis autem vel eum iure reprehenderit qui in ea voluptate velit esse quam nihil molestiae consequatur, vel illum qui dolorem eum fugiat quo voluptas nulla pariatur?"
          this.initialName = this.name;
          this.initialText = this.text
        }
      },
      updateMailInfo() {
        // TODO: send to back
      }
    },
    created() {
      this.getMailInfo()
    },
  }
</script>
