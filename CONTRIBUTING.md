###Getting started
Clone project:
```git clone git@github.com:ajaypremshankar/organizeyou.git```

###Picking an issue
* Choose any issue that interests you @ https://github.com/ajaypremshankar/organizeyou/issues.
* Assign issue to yourself. 
* Follow `Feature branch workflow` to create branch for yourself.
* NOTE: You cannot raise PR without an issue, it'll be rejected straightaway.

###Naming your branch
Branch name should be `<issue #>`-`<hyphenated-issue-title>`.

###Feature branch workflow

Create branch with your feature:

```git checkout -b $feature_name```

Write code. Commit changes:

```git commit -am "My feature is ready"```

Push your branch to GitLab:

```git push origin $feature_name```

Review your code on commits page.

Create a merge request.

We'll review the code & merge it to the master branch.