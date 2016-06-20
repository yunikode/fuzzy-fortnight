<template lang="html">
  <div class="notes" v-el:notes>
    <note
      v-for="note in notes"
      track-by="$index"
      :note="note"
      v-on:click="selectNote(note)"
      >
    </note>
  </div>
</template>

<script>
import Masonry from 'masonry-layout'
import noteRepository from '../../data/NoteRepository'
import Note from './Note'
export default {
  data () {
    return {
      notes: []
    }
  },
  computed: {},
  ready () {
    this.masonry = new Masonry(this.$els.notes, {
      itemSelector: '.note',
      columnWidth: 240,
      gutter: 16,
      fitWidth: true
    })
    noteRepository.on('added', (note) => {
      this.notes.unshift(note)
    })
    noteRepository.on('changed', ({key, title, content}) => {
      let outdatedNote = noteRepository.find(this.notes, key)
      outdatedNote.title = title
      outdatedNote.content = content
    })
    noteRepository.on('removed', ({key}) => {
      let noteToRemove = noteRepository.find(this.notes, key)
      this.notes.$remove(noteToRemove)
    })
  },
  attached () {},
  methods: {
    selectNote ({key, title, content}) {
      this.$dispatch('note.selected', {key, title, content})
    }
  },
  components: {
    Note
  },
  watch: {
    'notes': {
      handler () {
        this.masonry.reloadItems()
        this.masonry.layout()
      },
      deep: true // we also want to watch change inside individual notes
    }
  }
}
</script>

<style lang="css">
.notes {
  margin: 0 auto;
}
</style>
