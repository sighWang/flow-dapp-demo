## start project
```shell
yarn install ## 安装依赖

yarn start ## 启动前端界面
```
## Flow

### Flow简介

Flow是由Dapper Labs开发的，Dapper Labs是一家加拿大公司，也是创建CryptoKitties的团队。该公司的开发人员发现，当他们以太坊上运行的收藏品游戏用户数刚刚来到1万人时，网络就崩溃了。这让他们意识到需要一个新的区块链。Dapper Labs的愿景是吸引多达10亿人使用他们的DApp，然而没有任何区块链平台具备这样的扩展能力。

所以他们构建了Flow，一个更快的去中心化网络，可以为整个去中心化应用生态赋能，尤其是**游戏和数字收藏品**。Flow的核心架构保证了在不牺牲去中心化的前提下，提升了网络性能，以满足主流应用的需求。有了Flow之后，开发者们可以轻松构建足以应付亿万级别用户的应用程序。

Flow背后的设计理念,不是分片也不是分层.而是仿照多核CPU进行流水作业,将原先在区块链中一个节点要完成的收集，共识，执行，验证四步进行垂直分工,由四个专职节点合作完成.保证了ACID(atomicity, consistency, isolation, durability)的同时,不牺牲安全性与去中心化,与传统架构比还提高了56倍的吞吐量.

Flow采用与以太坊相似的Account状态结构,采用了PoS(权益证明)的方式来达成共识.开发了自己的面向资源的合约编程语言Cadence.在Flow上已有的成熟的Dapp有CryptoKittes和NBA Top Shot等.

### Flow的Account状态结构

![img](https://files.gitbook.com/v0/b/gitbook-28427.appspot.com/o/assets%2F-MWvb0OhU7NSCM4_Bbpz%2F-MYKuN_QGJKcFzDjl_Tr%2F-MYKv1te7JATXNcP0cRA%2Fcadence.png?alt=media&token=f3729b3c-683f-455a-ad26-b60393ccbc96)

以太坊的账户时基于私钥创建的,而Flow中账户是由区块链自己创建的,需要自己用椭圆曲线数字签名算法生成公私钥对,然后发送发送交易到区块链,通过该交易,新的账户被初始化,生成的密钥与账户关联.

Flow有两种账户,一种时公开账户,一种是权限账户.公开账户存储账户中可以公开的数据,权限账户存储账户中需要权限的数据.

Flow账户中的存储受StorageCapacity限制.

创建Flow账户是要收费的,约0.001FLOW.

> 提问:创建Flow账户要0.001FLOW,获取0.001FLOW要Flow账户,怎么半?

### Flow的智能合约与合约开发语言

脚本是为Flow专门设计的语言Cadence

### 智能合约

Flow的智能合约通过Cadence(面向资源的编程语言)语言编写,提出了mirco smart contract.提倡一个mirco smart contract只做一件事儿,然后合约间多进行复用.

可升级合约，合约代码可以以测试版跑在主网，再某个时间节点再选择确认版本，不可更改。

个人信息智能合约，在不同的dapp中都可以访问这些个人信息.

合约代码示例

```javascript
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

```javascript
import HelloWorld from 0x01

transaction {

  prepare(acct: AuthAccount) {}

  execute {
    log(HelloWorld.hello())
  }
}
```

更改profile合约上的姓名

```javascript
// File: ./src/flow/profile-set-name.tx.js

import * as fcl from "@onflow/fcl"
import * as t from "@onflow/types"

export async function setName(name) {
  const txId = await fcl
    .send([
      fcl.proposer(fcl.authz),
      fcl.payer(fcl.authz),
      fcl.authorizations([fcl.authz]),
      fcl.limit(35),
      fcl.args([fcl.arg(name, t.String)]),
      fcl.transaction`
        import Profile from 0xProfile

        transaction(name: String) {
          prepare(account: AuthAccount) {
            account
              .borrow<&Profile.Base{Profile.Owner}>(from: Profile.privatePath)!
              .setName(name)
          }
        }
      `,
    ])
    .then(fcl.decode)

  return fcl.tx(txId).onceSealed()
}
```

### Cadence

Cadence为数字资产而专门打造的智能合约编程语言,Cadence目前是一种解释语言。Flow团队的解释是为了快速实现语言特性,所以暂时是解释型语言,但是Cadence具有强静态类型,并且资源类型可以和Libra的Move语言匹配,所以后期是有条件转到编译型语言的,而且Flow团队也在为此努力.

Cadence还内置了交易的前置和后置检查条件

Cadence的语法借鉴了Swift和Rust,资源类型借鉴了Move.

Cadence的访问控制和Solidity也不一样,在以太坊中,默认资源是公开的.限制资源的访问需要额外根据"msg.sender"来判断.而在Flow中,资源默认是不公开的,要访问某对象,只有资源所有者授权访问着某种"关键字",才可以.

前置和后置检查

```javascript
fun factorial(_ n: Int): Int {
    pre {
        // Require the parameter `n` to be greater than or equal to zero.
        //
        n >= 0:
            "factorial is only defined for integers greater than or equal to zero"
    }
    post {
        // Ensure the result will be greater than or equal to 1.
        //
        result >= 1:
            "the result must be greater than or equal to 1"
    }

    if n < 1 {
       return 1
    }

    return n * factorial(n - 1)
}
```



### Flow的权益证明

Flow采用Hotstuff共识算法的变体进行权益证明.

### Flow的经济模型

创建账户,交易,存储都要收费.

为了从真实使用场景而不是投机中获利,Flow开创了多个大规模参与的项目.

保证固定节点奖励,手续费低于固定奖励就增发,多余固定奖励,就将多的存到第三方托管账户,以应对未来的通胀.

每年都为验证人节点提供总发行量的固定比例作为奖励,对质押节点的人也按照不同的比例做出激励.

Flow有两种稳定币,一种基于法币的稳定币.另外一种算法类稳定币,作为抵押资产,发行二级代币.

### Flow与不可能三角

扩容性不可能三角是Vitalik Buterin提出的一个[重要推论](https://github.com/ethereum/wiki/wiki/Sharding-FAQ#this-sounds-like-theres-some-kind-of-scalability-trilemma-at-play-what-is-this-trilemma-and-can-we-break-through-it)，它尚未得到正式证明，但几乎可以肯定对于同质化的区块链设计是符合的。

如果区块链网络中每一个节点都扮演相同的角色，则必须至少牺牲其中一个维度。 Flow并不“打破”或证伪这个不可能三角推论，而是绕过它。诀窍就在于，如果我们让不同的节点扮演不同的角色，我们就可以为系统中每个部分选择正确的取舍。

共识节点最容易遭受拜占庭攻击，福洛最大程度保证其安全性 和 去中心化。当然，这限制了它们的可扩展性，但这实际上并不是问题，因为我们不要求共识节点完成任何计算量大的工作。

 另一方面，我们提高了执行节点的 可扩展性 ，以显著提高吞吐量。这影响了这些节点的安全性和去中心化 ，我们通过由高度安全 和去中心化 的验证节点，对交易的每个步骤进行确认，来解决这一问题。 对每一类节点，这个不可能三角推论都是适用的，但是合并后，系统每一部分的弱点都能为其他部分的优势所弥补。

### Flow的Dapp开发

Flow的开发工具为@onflow/fcl (flow client Library )

有对应的简单的视频课

在Flow的入门dapp开发中，没有涉及智能合约的开发和发布智能合约，只讲了如何与已存在智能合约进行链接与通信。

提供了自己的Wallet Discovery功能，也就是说，只需要指定一个url，其中展示所有的钱包，不需要使用matemask也不用安装插件。

### 参考

https://pixelplex.io/blog/flow-vs-ethereum-comparison-best-platforms-for-nft/

https://cj.sina.com.cn/articles/view/6311913111/178382697020018fwb

https://docs.onflow.org/

### 最后

![image](https://user-images.githubusercontent.com/6202350/137053927-dcf71d01-0ceb-4760-8632-e5c659e9bd8b.png)

挂了主网的Flow
