---
inject: true
to: src/stories/index.js
skip_if: components/<%= name %>
prepend: true
---
import '../components/<%= name %>/<%= name %>.story'