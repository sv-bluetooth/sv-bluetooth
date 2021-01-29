'use strict';

let ledCharacteristic = null;
let ledDevice = null;
let ledService = null;
let poweredOn = false;

function onConnected() {
    document.querySelector('.connect-button').classList.add('hidden');
    document.querySelector('.color-buttons').classList.remove('hidden');
    document.querySelector('.mic-button').classList.remove('hidden');
    document.querySelector('.power-button').classList.remove('hidden');
    poweredOn = true;
}

function onDisconnected() {
    document.querySelector('.connect-button').classList.remove('hidden');
    document.querySelector('.color-buttons').classList.add('hidden');
    document.querySelector('.mic-button').classList.add('hidden');
    document.querySelector('.power-button').classList.add('hidden');
}

//a3dd50bf-f7a7-4e99-838e-570a086c661b
//a2e86c7a-d961-4091-b74f-2409e72efe26

async function connect() {
    console.log('Requesting Bluetooth Device...');
    navigator.bluetooth.requestDevice({
       
        filters: [{
            services: [0x7809]
        //   name: '1BP100'
         }]
        // optionalServices: [0x7809] // [0x7809]
      })
        .then(device => {
            console.log('> Found 1G device:' , device);
            console.log('Connecting to GATT Server...');
            device.addEventListener('gattserverdisconnected', onDisconnected)
            ledDevice=device
            return device.gatt.connect();
        })
        .then(server => {
            console.log('1... server: ', server);
            return server.getPrimaryService(0x7809); // 0x7809
        })
        .then(service => {
            console.log('2... service: ',service);
            ledService=service
            return (service.getCharacteristic(0x8A82))
            //return (service.getCharacteristics())
            //return (service.getCharacteristic(0x8A81))
            //.then (service.getCharacteristic(0x8A82))
        })
        .then(characteristic => {
            console.log('char:  ',characteristic) //.readValue();
            console.log('All ready5!');
            ledCharacteristic=characteristic;
            return onConnected()
            //return characteristic.getDescriptors()  // //.readValue()
            //let buffer = new Uint8Array([0x21,0xbb, 0x25, 0x05, 0x44])
            //return characteristic.writeValueWithResponse(buffer)
            //console.log(characteristic);
            //console.log('All ready!');
            //
            //onConnected();
        })
        .catch(error => {
            console.log('Argh! ' + error);
        });
}


function powerOn() {
    let data = service.getCharacteristic(0x8A81);
    return ledCharacteristic.writeValue(data)
        .catch(err => console.log('Error when powering on! ', err))
        .then(() => {
            poweredOn = true;
            toggleButtons();
            console.log(characteristic);
        });
  }
  
  function powerOff() {
    let data = new Uint8Array([0x8A81]);
    return ledCharacteristic.writeValue(data)
        .catch(err => console.log('Error when switching off! ', err))
        .then(() => {
            poweredOn = false;
            toggleButtons();
            console.log(characteristic);
        });
  }
  
  function togglePower() {
      if (poweredOn) {
          powerOff();
      } else {
          powerOn();
      }
  }
  
//   function toggleButtons() {
//       Array.from(document.querySelectorAll('.color-buttons button')).forEach(function(colorButton) {
//         colorButton.disabled = !poweredOn;
//       });
//       document.querySelector('.mic-button button').disabled = !poweredOn;
//   }

  function sendAccountID() {
    let data = new Uint8Array([0x8a81, 0x21, 0x01, 0x02, 0x03, 0x04]);
    console.log(ledCharacteristic);
    return ledCharacteristic.writeValue(data)
        .then(r=>{
            console.log('Sent Account ID 1 2 3 4 -- response: ', r)
        })
        .catch(err => console.log('Error when writing value! ', err));
  }
 
  function getRandomNumber() {
    return ledDevice.gatt.connect()
    .then(server => {
        console.log('x1... server: ', server);
        return server.getPrimaryService(0x7809); // 0x7809
    })
    .then(service => {
        console.log('x2... service: ',service);
        return (service.getCharacteristic(0x8a91))
    })
    .then(characteristic => {
        console.log('random Number object ',characteristic )
        return characteristic.readValue() // characteristic.readValue() 0x2902
    })
    .then(valueRead => {
        console.log('random Number valueRead characteristic.getDescriptors()| ',valueRead )
    })
    .catch(err => console.log('Error when reading Random Number value! ', err));

  }

  function setColor(red, green, blue) {
      let data = new Uint8Array([0x02, red, green, blue, 0x00, 0x01, 0x00]);

      console.log(ledCharacteristic);
      return ledCharacteristic.writeValue(data)

          .catch(err => console.log('Error when writing value! ', err));
  }
  
  function setColor(red, green, blue) {
    let data = new Uint8Array([0x02, red, green, blue, 0x00, 0x01, 0x00]);
    console.log(ledCharacteristic);
    return ledCharacteristic.writeValue(data)
        .catch(err => console.log('Error when writing value! ', err));
 }

  function red() {
      return setColor(255, 0, 0)
          .then(() => console.log('Color set to Red'));
  }
  
  function green() {
      return setColor(0, 255, 0)
          .then(() => console.log('Color set to Green'));
  }
  
  function blue() {
      return setColor(0, 0, 255)
          .then(() => console.log('Color set to Blue'));
  }
  
  function listen() {
      annyang.start({ continuous: true });
  }
  
  // Voice commands
  annyang.addCommands({
      'red': red,
      'green': green,
      'blue': blue,
      'yellow': () => setColor(127, 127, 0),
      'orange': () => setColor(127, 35, 0),
      'purple': () => setColor(127, 0, 127),
      'pink': () => setColor(180, 12, 44),
      'cyan': () => setColor(0, 127, 127),
      'white': () => setColor(127, 127, 127),
      'turn on': powerOn,
      'turn off': powerOff
  });
  
  // Install service worker - for offline support
  if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('serviceworker.js');
  }