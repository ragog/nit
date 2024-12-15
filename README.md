# nit - minimal command line notetaker

**nit** is a lightweight tool to take notes straight from the command line. It prioritizes speed and simplicity over everything else.

## Features

- **Write and read notes**: Write notes locally and retrieve them.
- **Multiple collections**: Organize notes using different local collections.

## Commands

### `w` - Write a Note
Write a new note with a title and body.

**Syntax:**
```
nit w <title> <body>
```

**Example:**
```
nit w shopping-list "Buy milk, eggs, and bread"
```
**Output:**  
`Writing note titled 'shopping-list'`

---

### `r` - Read a Note
Retrieve a note by its title.

**Syntax:**
```
nit r <title>
```

**Example:**
```
nit r shopping-list
```
**Output:**  
```
Buy milk, eggs, and bread
```
If multiple notes with the same title exist, all matching notes are displayed along with their timestamps.

---

### `l` - List Notes
List all notes in the active or specified collection.

**Syntax:**
```
nit l [-c <collection>]
```

**Options:**
- `-c <collection>`: Specify the collection name to list notes from.

**Examples:**

List all notes in active collection:
```
nit l
```
**Output:**  
```
Notes in active collection default_collection:
Shopping List (2024-12-15T12:00:00.000Z)
```
---

```
nit l -c my_collection
```

**Output:**  

```
Notes in collection my_collection:
Meeting Notes (2024-12-14T10:00:00.000Z)
```

If no notes are found, the output will indicate this.

---

### `c` - Switch or Create a Collection
Switch to a different note collection or create a new one.

**Syntax:**
```
nit c <name> [--new | -n]
```

**Options:**
- `--new, -n`: Create a new collection.

**Examples:**
```
nit c my_collection
```
Switches to the existing `my_collection` if found, or displays an error if it does not exist.

```
nit c my_collection --new
```
Creates a new collection `my_collection` and switches to it.

---

## Additional Details

### Active Collection
The `nit` CLI operates within an active collection by default, which is managed via the `state.json` file. You can switch or create collections using the `c` command.

### State File
The active collection is saved in `state.json`. When switching collections, the CLI updates this file to reflect the current active collection.

### Default Collection
When no collection is explicitly created or switched to, `nit` uses a default collection named `default_collection`.

## Future plans

### New features

- **Microblogging**: Publish notes online from your command line.
