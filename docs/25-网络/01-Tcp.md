---
title: TCP/UDP协议
---

## TCP 的特性

- TCP 提供一种面向连接的、可靠的字节流服务
- 在一个 TCP 连接中，仅有两方进行彼此通信。广播和多播不能用于 TCP
- TCP 使用校验和，确认和重传机制来保证可靠传输
- TCP 给数据分节进行排序，并使用累积确认保证数据的顺序不变和非重复
- TCP 使用滑动窗口机制来实现流量控制，通过动态改变窗口的大小进行拥塞控制

## 请简述 TCP\UDP 的区别

| 协议 | 连接性                            | 双工性      | 可靠性                     | 有序性                  | 有界性                  | 拥塞控制 | 传输速度 | 量级 | 头部大小   |
| ---- | --------------------------------- | ----------- | -------------------------- | ----------------------- | ----------------------- | -------- | -------- | ---- | ---------- |
| TCP  | 面向连接<br>(Connection oriented) | 全双工(1:1) | 可靠<br>(重传机制)         | 有序<br>(通过 SYN 排序) | 无, 有[粘包情况](#粘包) | 有       | 慢       | 低   | 20~60 字节 |
| UDP  | 无连接<br>(Connection less)       | n:m         | 不可靠<br>(丢包后数据丢失) | 无序                    | 有消息边界, **无粘包**  | 无       | 快       | 高   | 8 字节     |

UDP socket 支持 n 对 m 的连接状态, 在[官方文档](https://nodejs.org/dist/latest-v6.x/docs/api/dgram.html)中有写到在 `dgram.createSocket(options[, callback])` 中的 option 可以指定 `reuseAddr` 即 `SO_REUSEADDR`标志. 通过 `SO_REUSEADDR` 可以简单的实现 n 对 m 的多播特性 (不过仅在支持多播的系统上才有).

## TCP 粘包是怎么回事，如何处理? ✨

默认情况下, TCP 连接会启用延迟传送算法 (Nagle 算法), 在数据发送之前缓存他们. 如果短时间有多个数据发送, 会缓冲到一起作一次发送 (缓冲大小见  `socket.bufferSize`), 这样可以减少 IO 消耗提高性能.

如果是传输文件的话, 那么根本不用处理粘包的问题, 来一个包拼一个包就好了. 但是如果是多条消息, 或者是别的用途的数据那么就需要处理粘包.

可以参见网上流传比较广的一个例子, 连续调用两次 send 分别发送两段数据 data1 和 data2, 在接收端有以下几种常见的情况:

- A. 先接收到 data1, 然后接收到 data2 .
- B. 先接收到 data1 的部分数据, 然后接收到 data1 余下的部分以及 data2 的全部.
- C. 先接收到了 data1 的全部数据和 data2 的部分数据, 然后接收到了 data2 的余下的数据.
- D. 一次性接收到了 data1 和 data2 的全部数据.

其中的 BCD 就是我们常见的粘包的情况. 而对于处理粘包的问题, 常见的解决方案有:

1. 多次发送之前间隔一个等待时间
1. 关闭 Nagle 算法
1. 进行封包/拆包

_**方案 1**_<br />只需要等上一段时间再进行下一次 send 就好, 适用于交互频率特别低的场景. 缺点也很明显, 对于比较频繁的场景而言传输效率实在太低. 不过几乎不用做什么处理.<br />_**方案 2**_<br />关闭 Nagle 算法, 在 Node.js 中你可以通过  [`socket.setNoDelay()`](https://nodejs.org/dist/latest-v6.x/docs/api/net.html#net_socket_setnodelay_nodelay)  方法来关闭 Nagle 算法, 让每一次 send 都不缓冲直接发送.<br />该方法比较适用于每次发送的数据都比较大 (但不是文件那么大), 并且频率不是特别高的场景. 如果是每次发送的数据量比较小, 并且频率特别高的, 关闭 Nagle 纯属自废武功.<br />另外, 该方法不适用于网络较差的情况, 因为 Nagle 算法是在服务端进行的包合并情况, 但是如果短时间内客户端的网络情况不好, 或者应用层由于某些原因不能及时将 TCP 的数据 recv, 就会造成多个包在客户端缓冲从而粘包的情况. (如果是在稳定的机房内部通信那么这个概率是比较小可以选择忽略的)<br />_**方案 3**_<br />封包/拆包是目前业内常见的解决方案了. 即给每个数据包在发送之前, 于其前/后放一些有特征的数据, 然后收到数据的时候根据特征数据分割出来各个数据包.

## 为什么 udp 不会粘包？

1.TCP 协议是面向流的协议，UDP 是面向消息的协议

UDP 段都是一条消息，应用程序必须以消息为单位提取数据，不能一次提取任意字节的数据

2.UDP 具有保护消息边界，在每个 UDP 包中就有了消息头（消息来源地址，端口等信息），这样对于接收端来说就容易进行区分处理了。传输协议把数据当作一条独立的消息在网上传输，接收端只能接收独立的消息。接收端一次只能接收发送端发出的一个数据包,如果一次接受数据的大小小于发送端一次发送的数据大小，就会丢失一部分数据，即使丢失，接受端也不会分两次去接收

## 如何理解 TCP backlog？

> 本文来自[How TCP backlog works in Linux](http://veithen.io/2014/01/01/how-tcp-backlog-works-in-linux.html)

当应用程序调用`listen`系统调用让一个`socket`进入`LISTEN`状态时，需要指定一个参数：`backlog`。这个参数经常被描述为，新连接队列的长度限制。<br />![](https://cdn.nlark.com/yuque/0/2019/webp/128853/1561353458578-6c46a25a-f631-4e84-bd87-5ffe0c31c5b6.webp#align=left&display=inline&height=400&originHeight=400&originWidth=660&size=0&status=done&width=660)<br />tcp-state-diagram.png<br />由于`TCP`建立连接需要进行 3 次握手，一个新连接在到达`ESTABLISHED`状态可以被`accept`系统调用返回给应用程序前，必须经过一个中间状态`SYN RECEIVED`(见上图)。这意味着，`TCP/IP`协议栈在实现`backlog`队列时，有两种不同的选择：

1. 仅使用一个队列，队列规模由`listen`系统调用`backlog`参数指定。当协议栈收到一个`SYN`包时，响应`SYN/ACK`包并且将连接加进该队列。当相应的`ACK`响应包收到后，连接变为`ESTABLISHED`状态，可以向应用程序返回。这意味着队列里的连接可以有两种不同的状态：`SEND RECEIVED`和`ESTABLISHED`。只有后一种连接才能被`accept`系统调用返回给应用程序。<br />
1. 使用两个队列——`SYN`队列(待完成连接队列)和`accept`队列(已完成连接队列)。状态为`SYN RECEIVED`的连接进入`SYN`队列，后续当状态变更为`ESTABLISHED`时移到`accept`队列(即收到 3 次握手中最后一个`ACK`包)。顾名思义，`accept`系统调用就只是简单地从`accept`队列消费新连接。在这种情况下，`listen`系统调用`backlog`参数决定`accept`队列的最大规模。<br />

历史上，起源于`BSD`的`TCP`实现使用第一种方法。这个方案意味着，但`backlog`限制达到，系统将停止对`SYN`包响应`SYN/ACK`包。通常，协议栈只是丢弃`SYN`包(而不是回一个`RST`包)以便客户端可以重试(而不是异常退出)。<br />`TCP/IP详解 卷3`第`14.5`节中有提到这一点。书中作者提到，`BSD`实现虽然使用了两个独立的队列，但是行为跟使用一个队列并没什么区别。<br />在`Linux`上，情况有所不同，情况`listen`系统调用`man`文档页：

> The behavior of the backlog argument on TCP sockets changed with Linux 2.2. Now it specifies the queue length for completely established sockets waiting to be accepted, instead of the number of incomplete connection requests. The maximum length of the queue for incomplete sockets can be set using /proc/sys/net/ipv4/tcp_max_syn_backlog. When syncookies are enabled there is no logical maximum length and this setting is ignored.
> 意思是，`backlog`参数的行为在`Linux`2.2 之后有所改变。现在，它指定了等待`accept`系统调用的已建立连接队列的长度，而不是待完成连接请求数。待完成连接队列长度由`/proc/sys/net/ipv4/tcp_max_syn_backlog`指定；在`syncookies`启用的情况下，逻辑上没有最大值限制，这个设置便被忽略。

也就是说，当前版本的`Linux`实现了第二种方案，使用两个队列——一个`SYN`队列，长度系统级别可设置以及一个`accept`队列长度由应用程序指定。<br />现在，一个需要考虑的问题是在`accept`队列已满而一个已完成新连接需要用`SYN`队列移动到`accept`队列(收到 3 次握手中最后一个`ACK`包)，这个实现方案是什么行为。这种情况下，由`net/ipv4/tcp_minisocks.c`中`tcp_check_req`函数处理：

```
child = inet_csk(sk)->icsk_af_ops->syn_recv_sock(sk, skb, req, NULL);
    if (child == NULL)
        goto listen_overflow;
```

对于`IPv4`，第一行代码实际上调用的是`net/ipv4/tcp_ipv4.c`中的`tcp_v4_syn_recv_sock`函数，代码如下：

```
if (sk_acceptq_is_full(sk))
        goto exit_overflow;
```

可以看到，这里会检查`accept`队列的长度。如果队列已满，跳到`exit_overflow`标签执行一些清理工作、更新`/proc/net/netstat`中的统计项`ListenOverflows`和`ListenDrops`，最后返回`NULL`。这会触发`tcp_check_req`函数跳到`listen_overflow`标签执行代码。

```
listen_overflow:
    if (!sysctl_tcp_abort_on_overflow) {
        inet_rsk(req)->acked = 1;
        return NULL;
    }
```

很显然，除非`/proc/sys/net/ipv4/tcp_abort_on_overflow`被设置为`1`(这种情况下发送一个`RST`包)，实现什么都没做。<br />总结一下：`Linux`内核协议栈在收到 3 次握手最后一个`ACK`包，确认一个新连接已完成，而`accept`队列已满的情况下，会忽略这个包。一开始您可能会对此感到奇怪——别忘了`SYN RECEIVED`状态下有一个计时器实现：如果`ACK`包没有收到(或者是我们讨论的忽略)，协议栈会重发`SYN/ACK`包(重试次数由`/proc/sys/net/ipv4/tcp_synack_retries`决定)。<br />看以下抓包结果就非常明显——一个客户正尝试连接一个已经达到其最大`backlog`的`socket`：

```
0.000  127.0.0.1 -> 127.0.0.1  TCP 74 53302 > 9999 [SYN] Seq=0 Len=0
  0.000  127.0.0.1 -> 127.0.0.1  TCP 74 9999 > 53302 [SYN, ACK] Seq=0 Ack=1 Len=0
  0.000  127.0.0.1 -> 127.0.0.1  TCP 66 53302 > 9999 [ACK] Seq=1 Ack=1 Len=0
  0.000  127.0.0.1 -> 127.0.0.1  TCP 71 53302 > 9999 [PSH, ACK] Seq=1 Ack=1 Len=5
  0.207  127.0.0.1 -> 127.0.0.1  TCP 71 [TCP Retransmission] 53302 > 9999 [PSH, ACK] Seq=1 Ack=1 Len=5
  0.623  127.0.0.1 -> 127.0.0.1  TCP 71 [TCP Retransmission] 53302 > 9999 [PSH, ACK] Seq=1 Ack=1 Len=5
  1.199  127.0.0.1 -> 127.0.0.1  TCP 74 9999 > 53302 [SYN, ACK] Seq=0 Ack=1 Len=0
  1.199  127.0.0.1 -> 127.0.0.1  TCP 66 [TCP Dup ACK 6#1] 53302 > 9999 [ACK] Seq=6 Ack=1 Len=0
  1.455  127.0.0.1 -> 127.0.0.1  TCP 71 [TCP Retransmission] 53302 > 9999 [PSH, ACK] Seq=1 Ack=1 Len=5
  3.123  127.0.0.1 -> 127.0.0.1  TCP 71 [TCP Retransmission] 53302 > 9999 [PSH, ACK] Seq=1 Ack=1 Len=5
  3.399  127.0.0.1 -> 127.0.0.1  TCP 74 9999 > 53302 [SYN, ACK] Seq=0 Ack=1 Len=0
  3.399  127.0.0.1 -> 127.0.0.1  TCP 66 [TCP Dup ACK 10#1] 53302 > 9999 [ACK] Seq=6 Ack=1 Len=0
  6.459  127.0.0.1 -> 127.0.0.1  TCP 71 [TCP Retransmission] 53302 > 9999 [PSH, ACK] Seq=1 Ack=1 Len=5
  7.599  127.0.0.1 -> 127.0.0.1  TCP 74 9999 > 53302 [SYN, ACK] Seq=0 Ack=1 Len=0
  7.599  127.0.0.1 -> 127.0.0.1  TCP 66 [TCP Dup ACK 13#1] 53302 > 9999 [ACK] Seq=6 Ack=1 Len=0
 13.131  127.0.0.1 -> 127.0.0.1  TCP 71 [TCP Retransmission] 53302 > 9999 [PSH, ACK] Seq=1 Ack=1 Len=5
 15.599  127.0.0.1 -> 127.0.0.1  TCP 74 9999 > 53302 [SYN, ACK] Seq=0 Ack=1 Len=0
 15.599  127.0.0.1 -> 127.0.0.1  TCP 66 [TCP Dup ACK 16#1] 53302 > 9999 [ACK] Seq=6 Ack=1 Len=0
 26.491  127.0.0.1 -> 127.0.0.1  TCP 71 [TCP Retransmission] 53302 > 9999 [PSH, ACK] Seq=1 Ack=1 Len=5
 31.599  127.0.0.1 -> 127.0.0.1  TCP 74 9999 > 53302 [SYN, ACK] Seq=0 Ack=1 Len=0
 31.599  127.0.0.1 -> 127.0.0.1  TCP 66 [TCP Dup ACK 19#1] 53302 > 9999 [ACK] Seq=6 Ack=1 Len=0
 53.179  127.0.0.1 -> 127.0.0.1  TCP 71 [TCP Retransmission] 53302 > 9999 [PSH, ACK] Seq=1 Ack=1 Len=5
106.491  127.0.0.1 -> 127.0.0.1  TCP 71 [TCP Retransmission] 53302 > 9999 [PSH, ACK] Seq=1 Ack=1 Len=5
106.491  127.0.0.1 -> 127.0.0.1  TCP 54 9999 > 53302 [RST] Seq=1 Len=0
```

由于客户端的`TCP`实现在收到多个`SYN/ACK`包时，认为`ACK`包已经丢失了并且重传它。如果在`SYN/ACK`重试次数达到限制前，服务端应用从`accept`队列接收连接，使得`backlog`减少，那么协议栈会处理这些重传的`ACK`包，将连接状态从`SYN RECEIVED`变更到`ESTABLISHED`并且将其加入`accept`队列。否则，正如以上包跟踪所示，客户读会收到一个`RST`包宣告连接失败。<br />在客户端看来，第一次收到`SYN/ACK`包之后，连接就会进入`ESTABLISHED`状态。如果这时客户端首先开始发送数据，那么数据也会被重传。好在`TCP`有慢启动机制，在服务端还没进入`ESTABLISHED`之前，客户端能发送的数据非常有限。<br />相反，如果客户端一开始就在等待服务端，而服务端`backlog`没能减少，那么最后的结果是连接在客户端看来是`ESTABLISHED`状态，但在服务端看来是`CLOSED`状态。这也就是所谓的半开连接。<br />有一点还没讨论的是：`man listen`中提到每次收到新`SYN`包，内核往`SYN`队列追加一个新连接(除非该队列已满)。事实并非如此，`net/ipv4/tcp_ipv4.c`中`tcp_v4_conn_request`函数负责处理`SYN`包，请看以下代码：

```
if (sk_acceptq_is_full(sk) && inet_csk_reqsk_queue_young(sk) > 1) {
        NET_INC_STATS_BH(sock_net(sk), LINUX_MIB_LISTENOVERFLOWS);
        goto drop;
    }
```

可以看到，在`accept`队列已满的情况下，内核会强制限制`SYN`包的接收速率。如果有大量`SYN`包待处理，它们其中的一些会被丢弃。这样看来，就完全依靠客户端重传`SYN`包了，这种行为跟`BSD`实现一样。<br />下结论前，需要再研究以下`Linux`这种实现方式跟`BSD`相比有什么优势。`Stevens`是这样说的：

> 在`accept`队列已满或者`SYN`队列已满的情况下，`backlog`会达到限制。第一种情况经常发生在服务器或者服务器进程非常繁忙的情况下，进程没法足够快地调用`accept`系统调用从中取出已完成连接。后者是`HTTP`服务器经常面临的问题，在服务端客户端往返时间非常长的时候(相对于连接到达速率)，因为新`SYN`包在往返时间内都会占据一个连接对象。
> 大多数情况下`accept`队列都是空的，因为一旦有一个新连接进入队列，阻塞等待的`accept`系统调用将返回，然后连接从队列中取出。

`Stevens`建议的解决方案是简单地调大`backlog`。但有个问题是，应用程序在调优`backlog`参数时，不仅需要考虑自身对新连接的处理逻辑，还需要考虑网络状况，包括往返时间等。Linux 实现实际上分成两部分：应用程序只负责调解`backlog`参数，确保`accept`调用足够快以免`accept`队列被塞满；系统管理员则根据网络状况调节`/proc/sys/net/ipv4/tcp_max_syn_backlog`，各司其职。

## 常用端口号与对应的服务

| 端口     | 作用说明                                                                                                                                                              |
| -------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 21       | 21 端口主要用于 FTP（File Transfer Protocol，文件传输协议）服务。                                                                                                     |
| 23       | 23 端口主要用于 Telnet（远程登录）服务，是 Internet 上普遍采用的登录和仿真程序。                                                                                      |
| 25       | 25 端口为 SMTP（Simple Mail Transfer Protocol，简单邮件传输协议）服务器所开放，主要用于发送邮件，如今绝大多数邮件服务器都使用该协议。                                 |
| 53       | 53 端口为 DNS（Domain Name Server，域名服务器）服务器所开放，主要用于域名解析，DNS 服务在 NT 系统中使用的最为广泛。                                                   |
| 67、68   | 67、68 端口分别是为 Bootp 服务的 Bootstrap Protocol Server（引导程序协议服务端）和 Bootstrap Protocol Client（引导程序协议客户端）开放的端口。                        |
| 69       | TFTP 是 Cisco 公司开发的一个简单文件传输协议，类似于 FTP。                                                                                                            |
| 79       | 79 端口是为 Finger 服务开放的，主要用于查询远程主机在线用户、操作系统类型以及是否缓冲区溢出等用户的详细信息。                                                         |
| 80       | 80 端口是为 HTTP（HyperText Transport Protocol，超文本传输协议）开放的，这是上网冲浪使用最多的协议，主要用于在 WWW（World WideWeb，万维网）服务上传输信息的协议。     |
| 99       | 99 端口是用于一个名为“Metagram Relay”（亚对策延时）的服务，该服务比较少见，一般是用不到的。                                                                           |
| 109、110 | 109 端口是为 POP2（Post Office Protocol Version 2，邮局协议 2）服务开放的，110 端口是为 POP3（邮件协议 3）服务开放的，POP2、POP3 都是主要用于接收邮件的。             |
| 111      | 111 端口是 SUN 公司的 RPC（Remote ProcedureCall，远程过程调用）服务所开放的端口，主要用于分布式系统中不同计算机的内部进程通信，RPC 在多种网络服务中都是很重要的组件。 |
| 113      | 113 端口主要用于 Windows 的“Authentication Service”（验证服务）。 119 端口：119 端口是为“Network News TransferProtocol”（网络新闻组传输协议，简称 NNTP）开放的。      |
| 135      | 135 端口主要用于使用 RPC（Remote Procedure Call，远程过程调用）协议并提供 DCOM（分布式组件对象模型）服务。                                                            |
| 137      | 137 端口主要用于“NetBIOS Name Service”（NetBIOS 名称服务）。                                                                                                          |
| 139      | 139 端口是为“NetBIOS Session Service”提供的，主要用于提供 Windows 文件和打印机共享以及 Unix 中的 Samba 服务。                                                         |
| 143      | 143 端口主要是用于“Internet Message Access Protocol”v2（Internet 消息访问协议，简称 IMAP）。                                                                          |
| 161      | 161 端口是用于“Simple Network Management Protocol”（简单网络管理协议，简称 SNMP）。                                                                                   |
| 443      | 443 端口即网页浏览端口，主要是用于 HTTPS 服务，是提供加密和通过安全端口传输的另一种 HTTP。                                                                            |
| 554      | 554 端口默认情况下用于“Real Time Streaming Protocol”（实时流协议，简称 RTSP）。                                                                                       |
| 1024     | 1024 端口一般不固定分配给某个服务，在英文中的解释是“Reserved”（保留）。                                                                                               |
| 1080     | 1080 端口是 Socks 代理服务使用的端口，大家平时上网使用的 WWW 服务使用的是 HTTP 协议的代理服务。                                                                       |
| 1755     | 1755 端口默认情况下用于“Microsoft Media Server”（微软媒体服务器，简称 MMS）。                                                                                         |
| 4000     | 4000 端口是用于大家经常使用的 QQ 聊天工具的，再细说就是为 QQ 客户端开放的端口，QQ 服务端使用的端口是 8000。                                                           |
| 5554     | 在今年 4 月 30 日就报道出现了一种针对微软 lsass 服务的新蠕虫病毒——震荡波（Worm.Sasser），该病毒可以利用 TCP 5554 端口开启一个 FTP 服务，主要被用于病毒的传播。        |
| 5632     | 5632 端口是被大家所熟悉的远程控制软件 pcAnywhere 所开启的端口。                                                                                                       |
| 8080     | 8080 端口同 80 端口，是被用于 WWW 代理服务的，可以实现网页。                                                                                                          |

## 说一说 OSI 七层模型

![2019-06-24-12-51-02](https://xiaomuzhu-image.oss-cn-beijing.aliyuncs.com/f99d6190174db81cd9246f7f832b6587.png)

## 讲一下三次握手？✨

所谓三次握手(Three-way Handshake)，是指建立一个 TCP 连接时，需要客户端和服务器总共发送 3 个包。<br />三次握手的目的是连接服务器指定端口，建立 TCP 连接，并同步连接双方的序列号和确认号，交换 TCP 窗口大小信息。在 socket 编程中，客户端执行  `connect()`  时。将触发三次握手。

- 第一次握手(SYN=1, seq=x):<br />客户端发送一个 TCP 的 SYN 标志位置 1 的包，指明客户端打算连接的服务器的端口，以及初始序号 X,保存在包头的序列号(Sequence Number)字段里。<br />发送完毕后，客户端进入  `SYN_SEND`  状态。<br />
- 第二次握手(SYN=1, ACK=1, seq=y, ACKnum=x+1):<br />服务器发回确认包(ACK)应答。即 SYN 标志位和 ACK 标志位均为 1。服务器端选择自己 ISN 序列号，放到 Seq 域里，同时将确认序号(Acknowledgement Number)设置为客户的 ISN 加 1，即 X+1。 发送完毕后，服务器端进入  `SYN_RCVD`  状态。<br />
- 第三次握手(ACK=1，ACKnum=y+1)<br />客户端再次发送确认包(ACK)，SYN 标志位为 0，ACK 标志位为 1，并且把服务器发来 ACK 的序号字段+1，放在确定字段中发送给对方，并且在数据段放写 ISN 的+1<br />发送完毕后，客户端进入  `ESTABLISHED`  状态，当服务器端接收到这个包时，也进入  `ESTABLISHED`  状态，TCP 握手结束。<br />

三次握手的过程的示意图如下：

![2019-06-24-13-21-14](https://xiaomuzhu-image.oss-cn-beijing.aliyuncs.com/6c6890fa6f0ba339ad402daf7b9475c7.png)

## 讲一下四次握手？✨

TCP 的连接的拆除需要发送四个包，因此称为四次挥手(Four-way handshake)，也叫做改进的三次握手。客户端或服务器均可主动发起挥手动作，在 socket 编程中，任何一方执行  `close()`  操作即可产生挥手操作。

- 第一次挥手(FIN=1，seq=x)<br />假设客户端想要关闭连接，客户端发送一个 FIN 标志位置为 1 的包，表示自己已经没有数据可以发送了，但是仍然可以接受数据。<br />发送完毕后，客户端进入  `FIN_WAIT_1`  状态。<br />
- 第二次挥手(ACK=1，ACKnum=x+1)<br />服务器端确认客户端的 FIN 包，发送一个确认包，表明自己接受到了客户端关闭连接的请求，但还没有准备好关闭连接。<br />发送完毕后，服务器端进入  `CLOSE_WAIT`  状态，客户端接收到这个确认包之后，进入  `FIN_WAIT_2`  状态，等待服务器端关闭连接。<br />
- 第三次挥手(FIN=1，seq=y)<br />服务器端准备好关闭连接时，向客户端发送结束连接请求，FIN 置为 1。<br />发送完毕后，服务器端进入  `LAST_ACK`  状态，等待来自客户端的最后一个 ACK。<br />
- 第四次挥手(ACK=1，ACKnum=y+1)<br />客户端接收到来自服务器端的关闭请求，发送一个确认包，并进入  `TIME_WAIT`状态，等待可能出现的要求重传的 ACK 包。<br />服务器端接收到这个确认包之后，关闭连接，进入  `CLOSED`  状态。<br />客户端等待了某个固定时间（两个最大段生命周期，2MSL，2 Maximum Segment Lifetime）之后，没有收到服务器端的 ACK ，认为服务器端已经正常关闭连接，于是自己也关闭连接，进入  `CLOSED`  状态。<br />

四次挥手的示意图如下：

![2019-06-24-13-22-28](https://xiaomuzhu-image.oss-cn-beijing.aliyuncs.com/ff0ca6b81005c89ccfc28e190d0f3b9d.png)

## 重传机制

由于TCP的下层网络（网络层）可能出现丢失、重复或失序的情况，TCP协议提供可靠数据传输服务。为保证数据传输的正确性，TCP会重传其认为已丢失（包括报文中的比特错误）的包。TCP使用两套独立的机制来完成重传，一是基于时间，二是基于确认信息。

TCP在发送一个数据之后，就开启一个定时器，若是在这个时间内没有收到发送数据的ACK确认报文，则对该报文进行重传，在达到一定次数还没有成功时放弃并发送一个复位信号。

## 拥塞机制

TCP的拥塞控制机制主要是以下四种机制：

### 慢启动（慢开始）

- 在开始发送的时候设置cwnd = 1（cwnd指的是拥塞窗口）

- 思路：开始的时候不要发送大量数据，而是先测试一下网络的拥塞程度，由小到大增加拥塞窗口的大小。

- 为了防止cwnd增长过大引起网络拥塞，设置一个慢开始门限(ssthresh 状态变量)
    - 当cnwd < ssthresh，使用慢开始算法
    - 当cnwd = ssthresh，既可使用慢开始算法，也可以使用拥塞避免算法
    - 当cnwd > ssthresh，使用拥塞避免算法

### 拥塞避免

- 拥塞避免未必能够完全避免拥塞，是说在拥塞避免阶段将拥塞窗口控制为按线性增长，使网络不容易出现阻塞。

- 思路：让拥塞窗口cwnd缓慢的增大，即每经过一个返回时间RTT就把发送方的拥塞控制窗口加一

- 无论是在慢开始阶段还是在拥塞避免阶段，只要发送方判断网络出现拥塞，就把慢开始门限设置为出现拥塞时的发送窗口大小的一半。然后把拥塞窗口设置为1，执行慢开始算法。如图所示:

- 其中，判断网络出现拥塞的根据就是没有收到确认，虽然没有收到确认可能是其他原因的分组丢失，但是因为无法判定，所以都当做拥塞来处理

### 快速重传

- 快重传要求接收方在收到一个失序的报文段后就立即发出重复确认(为的是使发送方及早知道有报文段没有到达对方)。发送方只要连续收到三个重复确认就立即重传对方尚未收到的报文段，而不必继续等待设置的重传计时器时间到期。

- 由于不需要等待设置的重传计时器到期，能尽早重传未被确认的报文段，能提高整个网络的吞吐量

### 快速恢复

- 当发送方连续收到三个重复确认时，就执行“乘法减小”算法，把ssthresh门限减半。但是接下去并不执行慢开始算法。

- 考虑到如果网络出现拥塞的话就不会收到好几个重复的确认，所以发送方现在认为网络可能没有出现拥塞。所以此时不执行慢开始算法，而是将cwnd设置为ssthresh的大小，然后执行拥塞避免算法。

## 流量控制

一般来说，流量控制就是为了让发送方发送数据的速度不要太快，要让接收方来得及接收。TCP采用大小可变的滑动窗口进行流量控制，窗口大小的单位是字节。这里说的窗口大小其实就是每次传输的数据大小。

- 当一个连接建立时，连接的每一端分配一个缓冲区来保存输入的数据，并将缓冲区的大小发送给另一端。
- 当数据到达时，接收方发送确认，其中包含了自己剩余的缓冲区大小。（剩余的缓冲区空间的大小被称为窗口，指出窗口大小的通知称为窗口通告 。接收方在发送的每一确认中都含有一个窗口通告。）
- 如果接收方应用程序读数据的速度能够与数据到达的速度一样快，接收方将在每一确认中发送一个正的窗口通告。
- 如果发送方操作的速度快于接收方，接收到的数据最终将充满接收方的缓冲区，导致接收方通告一个零窗口 。发送方收到一个零窗口通告时，必须停止发送，直到接收方重新通告一个正的窗口。

## 推荐阅读

1. [(神三元)TCP协议灵魂之问，巩固你的网路底层基础🌟](https://juejin.cn/post/6844904070889603085#heading-27)

2. [Tcp/Udp那些事](https://juejin.cn/post/7067180657503387684#heading-10)

3. [饿了么面试](https://github.com/ElemeFE/node-interview/blob/master/sections/zh-cn/network.md#net)

4. [TCP](https://hit-alibaba.github.io/interview/basic/network/TCP.html)
