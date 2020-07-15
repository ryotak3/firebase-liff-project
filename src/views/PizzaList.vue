<template>
  <section class="section">
    <div class="container">
      <h1 class="title">Pizza menu</h1>
      <!-- TODO: add greeting text -->
      <h3 class="subtitle" v-if="userProfile">
        こんにちは {{ userProfile.displayName }} 何を食べますか？ 😀
      </h3>
      <h3 class="subtitle" v-else>こんにちは、何を食べますか？😀</h3>

      <div class="columns is-multiline">
        <!-- loading indicator -->
        <b-loading
          :is-full-page="true"
          :active.sync="isLoading"
          :can-cancel="false"
        ></b-loading>
        <!-- pizza -->
        <div
          class="column is-half"
          v-for="pizza in pizzas"
          v-bind:key="pizza.id"
        >
          <div class="card">
            <div class="card-image">
              <figure class="image is-4by3">
                <img v-bind:src="`${pizza.url}`" v-bind:alt="`${pizza.name}`" />
              </figure>
            </div>
            <div class="card-content">
              <div class="content">
                <p class="title is-2">
                  {{ pizza.name }}
                </p>
                <p class="subtitle">{{ pizza.price }} 円</p>
                <p class="subtitle is-6">
                  成分: {{ pizza.ingredients.toString() }}
                </p>
              </div>
              <b-button type="is-primary is-fullwidth" @click="order(pizza)"
                >今すぐ注文</b-button
              >
            </div>
          </div>
        </div>
        <!-- TODO: add share button-->
        <div class="share" v-if="userProfile && !isLoading">
          <p class="subtitle">
            または、何も考えられない場合友達にメニューを送って、あなたが選択できるようにしてください。
          </p>
          <button class="button" @click="share">メニューを共有</button>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
const firebaseApp = require("../firebase.js");
const line = require("../line-config");
export default {
  data() {
    return {
      pizzas: [],
      isLoading: false,
      userProfile: null,
    };
  },
  mounted() {
    const liff = this.$liff;
    liff
      .init({
        liffId: "1654446020-lDzB0BgG",
      })
      .then(() => {
        console.log("LIFF initialize finished");
        if (liff.isLoggedIn()) {
          liff
            .getProfile()
            .then((profile) => {
              console.log(JSON.stringify(profile));
              this.userProfile = profile;
            })
            .catch((err) => {
              console.error(err);
            });
        } else {
          console.log("LIFF is not logged in");
          liff.login();
        }
      })
      .catch((err) => {
        console.error("Error initialize LIFF: ", err);
      });
    // TODO: get pizza from Firestore
    this.isLoading = true;
    firebaseApp.pizzasCollection.get().then((snapshot) => {
      this.pizzas = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      this.isLoading = false;
    });
  },
  methods: {
    order(pizza) {
      console.log(pizza.name);
      const liff = this.$liff;
      const context = liff.getContext();
      if (context && context.type !== "none") {
        liff
          .sendMessages([
            {
              type: "text",
              text: `注文${pizza.name}`,
            },
          ])
          .then(function() {
            console.log("Message sent");
            liff.closeWindow();
          })
          .catch(function(error) {
            console.log("Error sending message: " + error);
          });
      }
    },
    share() {
      console.log("share menu");
      // TODO: implement share target picker
      const liff = this.$liff;
      liff
        .shareTargetPicker([
          {
            type: "text",
            text: "ピザのメニューを見てください" + line.menuLiffUrl,
          },
        ])
        .then(function() {
          console.log("Message sent");
        })
        .catch(function(error) {
          console.log("Error sending message: " + error);
        });
    },
  },
};
</script>

<style scoped>
.share {
  margin: 8px auto;
  padding: 16px;
}
</style>
