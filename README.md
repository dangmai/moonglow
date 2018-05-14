moonglow
========

The Moonglow framework

<!-- toc -->
* [Usage](#usage)
* [Commands](#commands)
<!-- tocstop -->
# Usage
<!-- usage -->
```sh-session
$ npm install -g moonglow
$ mg COMMAND
running command...
$ mg (-v|--version|version)
moonglow/0.1.0 linux-x64 node-v10.0.0
$ mg --help [COMMAND]
USAGE
  $ mg COMMAND
...
```
<!-- usagestop -->
# Commands
<!-- commands -->
* [`mg hello [FILE]`](#mg-hello-file)
* [`mg help [COMMAND]`](#mg-help-command)

## `mg hello [FILE]`

describe the command here

```
USAGE
  $ mg hello [FILE]

OPTIONS
  -f, --force
  -h, --help       show CLI help
  -n, --name=name  name to print

EXAMPLE
  $ mg hello
  hello world from ./src/hello.ts!
```

_See code: [src/commands/hello.ts](https://github.com/dangmai/moonglow/blob/v0.1.0/src/commands/hello.ts)_

## `mg help [COMMAND]`

display help for mg

```
USAGE
  $ mg help [COMMAND]

ARGUMENTS
  COMMAND  command to show help for

OPTIONS
  --all  see all commands in CLI
```

_See code: [@oclif/plugin-help](https://github.com/oclif/plugin-help/blob/v1.2.10/src/commands/help.ts)_
<!-- commandsstop -->
