# CheapTripAngularClient

<b>Versioning conventions</b><br>
Dev - dx.x.x <br>
Release - rx.x.x <br>
Master - x.x.x <br>

# For Testers

<h3>When a new issue is found</h3>
Create a new issue here:<br>
https://github.com/talmantel/CheapTripAngularClient/issues/new
<br>
Make sure to add appropriate labels including:
<ul>
<li>bug</li>
<li>display: desktop</li>
<li>display: mobile</li>
<li>version: {version number} (example: "version: d0.0.1")</li>
</ul>

Assign Olga (OlgaZaleskovskaya) or any developer if you know who is reponsible for resolving the issue<br>



<h3>When a new version is released</h3>
Use this link to see non-verified closed issues:<br>
https://github.com/talmantel/CheapTripAngularClient/issues?q=is%3Aissue+-label%3Averified+state%3Aclosed
<br>
To verify an issue was resolved, add the label 'verified' to it. <br>
If the issue was not resolved, reopen the issue.


# For Developers

<h3>Main Branches</h3>
<ul>
<li>Dev - main development branch. All new features and all bugs for current version should be done here</li>
<li>Release - once development of current version is done, Dev is merged into release for testing and final bugfixes</li>
<li>Master - once testing on release branch is done, release is merged into master to be deployed in production</li>
</ul>


<h3>Development</h3>
<ul>
<li>Create a new branch from dev\release\master, name it with the feature or bug you are dealing with</li>
<li>Develop...</li>
<li>Merge remote dev\release\master branch into your branch</li>
<li>Push your branch to remote</li>
<li>Create a pull request: https://github.com/talmantel/CheapTripAngularClient/pull/new/<b>your_branch_name</b> into dev\release\master</li>
</ul>

<h3>Resolving issues</h3>
Link to issues fixed in a specific pull request or commit by typing "Resolves: #{issue number}" in your pull request description or commit message<br>
For example "Resolves: #123"<br>
For more details see https://docs.github.com/en/enterprise/2.16/user/github/managing-your-work-on-github/closing-issues-using-keywords

You can also see open issues assigned to you here: https://github.com/talmantel/CheapTripAngularClient/issues/assigned/@me <br>
And comment \ close etc.

