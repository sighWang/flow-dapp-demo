## start project
```shell
yarn install ## 安装依赖

yarn start ## 启动前端界面
```
## Flow

### Flow简介

Flow是由加密猫背后团队构想的,低延迟的消费类应用程序,游戏和数字资产而设计.背后的设计理念,不是分片也不是分层layer1 layer2.而是仿照多核CPU进行流水作业,将原先在区块链中一个节点要完成的收集，共识，执行，验证四步进行垂直分工,由四个专职节点合作完成.保证了ACID并不牺牲安全性与去中心化,与传统架构比还提高了56倍的吞吐量.Flow团队的白皮书中写道,在合理的拜占庭假设中,他们可以验证计算方案的安全性与活性证明.

Flow采用Hotstuff共识算法的变体,采用权益证明.

数据结构采用的是Account模型

脚本是为Flow专门设计的语言Cadence

发现Flow主网挂了..

![image](https://user-images.githubusercontent.com/6202350/136907712-ddabf430-a300-4ad3-b387-e028d0ee6471.png)


### 智能合约
Flow的智能合约通过Cadence(面向资源的编程语言)语言编写,提出了mirco smart contract.提倡一个mirco smart contract只做一件事儿,然后合约间多进行复用.

Cadence为数字资产而专门打造的智能合约编程语言,Cadence目前是一种解释语言。Cadence开发人员正在努力寻找方法，将Cadence编译成Move字节码，以便在Move虚拟机上运行。
可升级合约，合约代码可以以测试版跑在主网，再某个时间节点再选择确认版本，不可更改。

个人信息智能合约，在不同的dapp中都可以访问这些个人信息.

合约代码示例
```
// HelloWorld.cdc
pub contract HelloWorld {

    // Declare a public field of type String.
    //
    // All fields must be initialized in the init() function.
    pub let greeting: String

    // The init() function is required if the contract contains any fields.
    init() {
        self.greeting = "Hello, World!"
    }

    // Public function that returns our friendly greeting!
    pub fun hello(): String {
        return self.greeting
    }
}
```
调用代码示例
```
import HelloWorld from 0x01

transaction {

  prepare(acct: AuthAccount) {}

  execute {
    log(HelloWorld.hello())
  }
}
```

### 不可能三角与Flow
 
 扩容性不可能三角是Vitalik Buterin提出的一个[重要推论](https://github.com/ethereum/wiki/wiki/Sharding-FAQ#this-sounds-like-theres-some-kind-of-scalability-trilemma-at-play-what-is-this-trilemma-and-can-we-break-through-it)，它尚未得到正式证明，但几乎可以肯定对于同质化的区块链设计是符合的。如果区块链网络中每一个节点都扮演相同的角色，则必须至少牺牲其中一个维度。 Flow并不“打破”或证伪这个不可能三角推论，而是绕过它。
 诀窍就在于，如果我们让不同的节点扮演不同的角色，我们就可以为系统中每个部分选择正确的取舍。. 共识节点最容易遭受拜占庭攻击，福洛最大程度保证其安全性 和 去中心化。当然，这限制了它们的可扩展性，但这实际上并不是问题，因为我们不要求共识节点完成任何计算量大的工作。 另一方面，我们提高了执行节点的 可扩展性 ，以显著提高吞吐量。这影响了这些节点的安全性和去中心化 ，我们通过由高度安全 和去中心化 的验证节点，对交易的每个步骤进行确认，来解决这一问题。 对每一类节点，这个不可能三角推论都是适用的，但是合并后，系统每一部分的弱点都能为其他部分的优势所弥补
 
### Flow的Dapp开发

Flow的开发工具为@onflow/fcl (flow client Library )

有对应的简单的视频课

flow中与链交互分两种，只是获取资源的叫script。需要修改增加资源的叫tx。

在Flow的入门dapp开发中，没有涉及智能合约的开发和发布智能合约，只讲了如何与已存在智能合约进行链接与通信。

提供了自己的Wallet Discovery功能，也就是说，只需要指定一个url，其中展示所有的钱包，不需要使用matemask也不用安装插件。

我们可以为初学者提供比较可以简单运行的例子，让他们快速上手体验。

提出了micro contract，希望合约只做一点简单的事儿并可以复用， 再编写合约时也可以导入其他合约。

