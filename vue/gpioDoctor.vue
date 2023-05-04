<template>
  <div class="container">
    <div class="item">
      <h4>GPIO Doctor</h4>
      <p>Here you can quickly detect GPIO roles of an unknown device. </p>

      <h4>Usage warning</h4>
      <p>This tool will override your current GPIO settings. Use with caution. Backup your current template if needed.</p>
      

      <h4>How to use</h4>
      <p>This is TODO</p>
 
    </div>
    <div class="item">
      <button @click="begin('')">Begin Output Testing</button>
    
      <h4>GPIO Doctor Pins</h4> 
      <div v-for="(role, index) in pins.roles" :key="index">
        <span class="pin-index">P{{index}}</span>
        <button @click="toggle(index)" :class="pins.states[index] ? 'button-green' : 'button-red'">
         {{ pins.states[index] ? 'Set Low' : 'Set High' }}
         </button>
        <select v-model="pins.roles[index]">
          <option v-for="(name, index2) in pins.rolenames" :value="index2" :key="index2" :selected="(role == index2)">{{name}}</option>
        </select>
        <input type="number" min="0" max="32" step="1" v-model="pins.channels[index]">
      </div>


    </div>
   </div>
</template>

<script>
  module.exports = {

    data: ()=>{
      return {
        msg: 'world!',
        rfdata: null,
        display: '',
        pins:{ rolenames:[], roles:[], channels:[], states:[] },
      }
    },
    methods:{
        begin() {

        },
        toggle(idx){
            //alert(idx);
           // this.pins.states[idx] = !this.pins.states[idx];
           this.$set(this.pins.states, idx, !this.pins.states[idx]);
            alert("Toggled " +this.pins.states[idx]);
        },
      getPins(){
        let url = window.device+'/api/pins';
        fetch(url)
            .then(response => response.json())
            .then(res => {
              res.states = new Array(res.roles.length).fill(0);
              for(let i = 0; i < res.roles.length; i++)
              {
                  res.states[i] = i%2==0;
              }
              this.pins = res;
            })
            .catch(err => {
              this.error = err.toString();
              console.error(err)
            }); // Never forget the final catch!

      },
        getinfo(){
            let url = window.device+'/api/info';
            fetch(url)
                .then(response => response.json())
                .then(res => {

                })
                .catch(err => {
                    this.error = err.toString();
                    console.error(err)
                }); // Never forget the final catch!
        }       
    },
    mounted (){
        this.msg = 'fred';


        console.log('mounted tools');
        this.getinfo();
        this.getPins();
    }
  }
//@ sourceURL=/vue/gpioDoctor.vue
</script>

<style scoped>
.display pre{
    font-family: 'Courier New', Courier, monospace;
    font-size: 14px;
}
  .container {
    display: flex;
    justify-content: center;
  }

  .item {
    padding: 0 15px;
    max-width: 400px;
  }
  .pin-index {
    display: inline-block;
    width: 25px;
  }
  .button-green {
  background-color: green;
  color: white;
}

.button-red {
  background-color: red;
  color: white;
}
</style>
