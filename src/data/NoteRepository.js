import Firebase from 'firebase'
import EventEmitter from 'events'

// extend EventEmitter so user of NoteRepository can react to our own defined events
class NoteRepository extends EventEmitter {
  constructor () {
    super()
    Firebase.initializeApp({
      apiKey: 'AIzaSyDxtRgYOAUf3-FuYBU369vNG05bBpwPex4',
      authDomain: 'gkeep-vuefire-2f145.firebaseapp.com',
      databaseURL: 'https://gkeep-vuefire-2f145.firebaseio.com',
      storageBucket: 'gkeep-vuefire-2f145.appspot.com'
    })
    // firebase reference to the notes
    this.ref = Firebase.database().ref().child('notes')
    this.attachFirebaseListeners()
  }
  // attach listeners to Firebase
  attachFirebaseListeners () {
    this.ref.on('child_added', this.onAdded, this)
    this.ref.on('child_removed', this.onRemoved, this)
    this.ref.on('child_changed', this.onChanged, this)
  }
  onAdded (snapshot) {
    let note = this.snapshotToNote(snapshot)
    this.emit('added', note)
  }
  onRemoved (oldSnapshot) {
    let note = this.snapshotToNote(oldSnapshot)
    this.emit('removed', note)
  }
  onChanged (snapshot) {
    let note = this.snapshotToNote(snapshot)
    this.emit('changed', note)
  }
  // processes the snapshot to consistent note with key
  snapshotToNote (snapshot) {
    let key = snapshot.key
    let note = snapshot.val()
    note.key = key
    return note
  }
  findIndex (notes, key) {
    return notes.findIndex(note => note.key === key)
  }
  find (notes, key) {
    return notes.find(note => note.key === key)
  }
  create ({title = '', content = ''}, onComplete) {
    this.ref.push({title, content}, onComplete)
  }
  update ({key, title = '', content = ''}, onComplete) {
    this.ref.child(key).update({title, content}, onComplete)
  }
  remove ({key}, onComplete) {
    this.ref.child(key).remove(onComplete)
  }
}

// instance to be shared across imports
export default new NoteRepository()
