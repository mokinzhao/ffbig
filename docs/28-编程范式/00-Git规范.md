---
title: Git 分支管理及发布规范
---

# Git 分支管理及发布规范

## 一、Git Flow Convention

When you develop a new feature, you are supposed to start a new feature branch feature/\*, When you develop a new hotfix, you are supposed to start a new hotfix branch hotfix/\*

### Feature

Anytime when you would like to start a new feature (new independent feature), you are supposed to start a new branch named as feature/[your develop id]-[feature desc]-[create Date],such as, feature/ylzhaol-dataflow

### Hotfix

Anytime when you would like to start a new hotfix, you are supposed to start a new branch named as hotfix/[your develop id]-[feature desc]-[create Date], such as, hotfix/ylzhao-authentication-bug

### Develop

Suggest to keep develop branch a place for community developers and also team members to merge features.

## 二、Code Commit Process

1. Local test your code until you are sure it work as desired

2. Review the code diff before commit to your branch to remove any diff that might distract code reviewer from understanding your code. (Reminder: Only fix **one thing** in one PR)

3. Create PR in GitLab for[https://gitlab.zmaxis.com/](https://gitlab.zmaxis.com/?fileGuid=HtKDCxcXdhJCcqy3)

4. Kindly add any additional reviewers who might need to know about this change besides the default reviewers

5. If the code diff is non-trivial, schedule a meeting with code reviewers to walk through it.

6. Revise the PR base on code review feedback & comments

7. Only merge one someone else has "approved" your PR

8. Commit message advice add type

- feat：新功能（feature）
- add : 增加文件
- update : 更新文件
- fix：修补 bug
- remove：删除文件
- docs：文档（documentation）
- style： 格式（不影响代码运行的变动）
- refactor：重构（即不是新增功能，也不是修改 bug 的代码变动）
- test：增加测试
- chore：构建过程或辅助工具的变动

## 三、合并规范及冲突处理原则

1. 开发成员 开发新功能 需要基于 master 建立独立的分支，格式:feature/[your develop id]- [feature desc]-[create Date] 例如: feature/ylzhao-addImgList-2019.10.12。

2. 当你分支代码要合并到对应的测试或线上环境时，请在[https://gitlab.yonghui.cn/](https://gitlab.yonghui.cn/?fileGuid=HtKDCxcXdhJCcqy3)上提交 merge request 操作，your branch into dev/master，填写对应的 review 人员(重要),最终由 review 人员进行最后的合并发布操作。

3. 当遇到合并冲突时候：

- 解决方式一（基于当前分支解决）：在本地自己分支下拉取目标分支代码进行合并 ，只保留冲突文件，重置其他非冲突文件，处理完冲突文件后仅推送该冲突文件到自己分支（重要）,这时候方可再进行 merge request 流程。
- 解决方式二（基于目标分支解决）：在本地基于目标分支上拉去自己分支进行合并。解决冲突文件，由 review 人员在旁观看（重要）,在 review 人员确认无误的情况下进行 push 代码到目标分支上。
