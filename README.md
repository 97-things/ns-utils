# 97-utils

Utility to speed up the work with '97 things' repositories.

## Install

```
npm install ns-utils -g
```

## Example of Usage

1. Create folder for translation
  ```
  mkdir fr
  cd fr
  ```

2. Initialize structure
  ```
  ns-utils init
  ```

3. Translate things

4. Create summary
  ```
  ns-utils summary
  ```

5. Sort things after complete translation
  ```
  ns-utils sort
  ```

6. Add link your translation to LANGS.md


## Commands

### Create Structure

```
ns-utils init
```

Create 97 things folders with empty README.md

### Create Summary

```
ns-utils summary
```

Generate SUMMARY.md from things folders with README.md

### Sort Things

```
ns-utils sort
```

Sort things in folders and in SUMMARY.md
