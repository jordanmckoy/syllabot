// Import necessary Prisma Client and other dependencies
import { PrismaVectorStore } from "langchain/vectorstores/prisma";
import { OpenAIEmbeddings } from "langchain/embeddings/openai";
import { PrismaClient, Prisma } from "@prisma/client";

const prisma = new PrismaClient();

// Use the `withModel` method to get proper type hints for `metadata` field:
const vectorStore = PrismaVectorStore.withModel(prisma).create(
    new OpenAIEmbeddings(
        {
            openAIApiKey: process.env.OPENAI_KEY,
        }
    ),
    {
        prisma: Prisma,
        tableName: "Unit",
        vectorColumnName: "vector",
        columns: {
            id: PrismaVectorStore.IdColumn,
            content: PrismaVectorStore.ContentColumn,
        },
    }
);

const description = `In the realm of Database Management Systems (DBMS), ensuring the integrity and recoverability of data is paramount. This comprehensive text delves into the intricate world of database recovery, shedding light on the various failure scenarios that can disrupt database operations. From hardware and software-related system crashes to media failures, application software errors, and even natural disasters, the potential threats to a database's stability are manifold. The text underscores the need for a well-structured recovery strategy to counteract these challenges effectively.`

const markdown = `# The Need for Recovery

There are many different types of failure that can affect database processing, each of which has to be dealt with in a different manner. Some failures affect main memory only, while others involve non-volatile (secondary) storage. Among the causes of failure are:

- System crash due to hardware or software errors, resulting in loss of main memory.
- Media failure, such as head crashes or unreadable media, resulting in the loss of parts of secondary storage.
- Application software errors, such as logical errors in the program that is accessing the database, which cause one or more transactions to fail.
- Natural physical disasters, such as fires, floods, earthquakes, or power failures.
- Carelessness or unintentional destruction of data or facilities by operators or users.
- Sabotage or intentional corruption or destruction of data, hardware, or software facilities.

Whatever the cause of the failure, there are two principal effects that we need to consider: the loss of main memory, including the database buffers; and the loss of the disk copy of the database.

## Transactions and Recovery

The recovery manager has to ensure that, on recovery from failure, either all the effects of a given transaction are permanently recorded in the database or none of them are. The situation is further complicated by the fact that database writing is not a single-step action, and it is, therefore, possible for a transaction to have committed, but for its effects not to have been permanently recorded in the database simply because they have not yet reached the database.

The database buffers occupy an area in main memory from which data is transferred to and from secondary storage. It is only once the buffers have been flushed to secondary storage that any update operation can be regarded as permanent. This flushing of buffers to the database can be triggered by a specific command or automatically when the buffers become full. The explicit writing of the buffers to secondary storage is known as force-writing.

If a failure occurs between writing to the buffers and flushing the buffers to secondary storage, the recovery manager must determine the status of the transaction that performed the write at the time of failure. If the transaction had issued its commit, then to ensure durability, the recovery manager would have to redo that transaction’s updates to the database. On the other hand, if the transaction had not committed at the time of failure, then the recovery manager would have to undo (rollback) any effects of that transaction on the database to guarantee transaction atomicity. If only one transaction has to be undone, this is referred to as partial undo. When all active transactions have to be undone, this is known as global undo.

## Recovery Facilities

A DBMS should provide the following facilities to assist with recovery:

- A backup mechanism, which makes periodic backup copies of the database.
- Logging facilities, which keep track of the current state of transactions and database changes.
- A checkpoint facility, which enables updates to the database that are in progress to be made permanent.
- A recovery manager, which allows the system to restore the database to a consistent state following a failure.

## Backup Mechanism

The DBMS should provide a mechanism to allow backup copies of the database and the log file to be made at regular intervals without necessarily having to first stop the system. The backup copy of the database can be used in the event that the database has been damaged or destroyed. A backup can be a complete copy of the entire database or an incremental backup. An incremental backup consists only of modifications made since the last complete or incremental backup. Typically, the backup is stored on offline storage, such as magnetic tape.

## Log File

To keep track of database transactions, the DBMS maintains a special file called a log (or journal) that contains information about all updates to the database. The log may contain the following data:

- Transaction records containing
  - Transaction identifier
  - Type of log record (transaction start, insert, update, delete, abort, commit).
  - Identifier of the data item affected by the database action (insert, delete & update operations).
  - Before-image (old value) of the data item: that is its value before change (update and delete operations only).
  - After-image (new value) of the data item: that is, its value after change (insert and update operations only).
- Log management information, such as a pointer to previous and next log records for that transaction (all operations).
- Checkpoint records

The log is often used for purposes other than recovery (for example, for performance monitoring and auditing). In this case, additional information may be recorded in the log file (for example, database reads, user logons, logoffs, etc.), but these are not relevant to recovery and therefore are omitted from this discussion.

Due to the importance of the transaction log file in the recovery process, the log may be duplexed or triplexed so that if one copy is damaged, another can be used. What medium would be most appropriate to store log files? How will this help with quick recovery? It should be noted that the log file is a potential bottleneck, and the speed of the writes to the log file can be critical in determining the overall performance of the database.

## Checkpointing

The information in the log file is used to recover from a database failure. One difficulty with this scheme is that when a failure occurs, we may not know how far back in the log to search, and we may end up redoing transactions that have been safely written to the database. To limit the amount of searching and subsequent processing that we need to carry out on the log file, we can use a technique called checkpointing.

A checkpoint is the point of synchronization between the database and the transaction log file. All buffers are force-written to secondary storage.

Checkpoints are scheduled at predetermined intervals and involve the following operations:

- Writing all log records in main memory to secondary storage.
- Writing the modified blocks in the database buffer to secondary storage.
- Writing a checkpoint record to the log file. This record contains the identifiers of all transactions that are active at the time of the checkpoint.

If transactions are performed serially, when a failure occurs we check the log file to find the last transaction that started before the last checkpoint. Any earlier transactions would have been committed previously, and would have been written to the database at the checkpoint. Therefore, we need only redo the ones that were active at the checkpoint and any subsequent transactions for which both start and commit records appear on the log. If a transaction is active at the time of failure, the transaction must be undone. If transactions are performed concurrently, we redo all transactions that have committed since the checkpoint and undo all transactions that were active at the time of the crash.

Generally, checkpointing is a relatively inexpensive operation, and it is often possible to take three or four checkpoints an hour. In this way, no more than 15-20 minutes of work will need to be recovered.

## Recovery Techniques

The particular recovery procedure to be used is dependent on the extent of the damage that has occurred to the database. Let’s consider two cases:

- If the database has been extensively damaged, for example, a disk head crash has occurred and destroyed the database, then it is necessary to restore the last backup copy of the database and reapply the update operations of committed transactions using the log file. This assumes that the log file has not been damaged too. It is recommended that the log file be stored on a disk separate from the main database files. This reduces the risk of both being damaged at the same time.
- If the database has not been physically damaged but has become inconsistent, then it is necessary to undo the changes that caused the inconsistency. It may also be necessary to redo some transactions to ensure that the updates they performed have reached secondary storage. Here, we do not need to use the backup copy of the database but can restore the database to a consistent state using the before and after images held on the log file.

We now look at two techniques for recovery from the latter situation: that is, the case where the database has not been destroyed but is in an inconsistent state.

## Recovery Techniques using Deferred Update

Using this protocol, updates are not written to the database until after a transaction has reached its commit point. If a transaction fails before it reaches this point, it will not have modified the database, and no undoing of changes will be necessary. However, it may be necessary to redo the updates of committed transactions as their effects may not have reached the database. In this way, we use the log file to protect against system failures in the following way:

- When a transaction starts, write a transaction start record in the log.
- When any write operation is performed, write a log record containing all the data specified previously (excluding the before-image of the update). Do not actually write the update to the database buffer or the database itself.
- When a transaction is about to commit, write a transaction commit log record, write all the log records for the transaction to disk and then commit the transaction. Use the log records to perform the actual updates to the database.
- If a transaction aborts, ignore the log records for the transaction and do not perform the writes.

Note that we write the log records to disk before the transaction is actually committed so that if a system failure occurs while the actual database updates are in progress, the log records will survive, and the updates can be applied later. In the event of failure, we examine the log to identify the transactions that were in progress at the time of failure. Starting at the last entry in the log file, we go back to the most recent checkpoint record:

- Any transaction with transaction start and transaction commit log records should be redone. The redo procedure performs all the writes to the database using the after-image log records for the transaction, in the order in which they were written to the log. If this writing has been performed already before the failure, the write has no effect on the data item, so there is no damage done if we write the data again (that is, the operation is idempotent). However, this method guarantees that we will update any data item that was not properly updated prior to the failure.
- For any transaction with transaction start and transaction abort log records, we do nothing since no actual writing was done to the database, so these transactions do not have to be undone.

If a second system crash occurs during recovery, the log records are used again to restore the database. With the form of the write log records, it does not matter how many times we redo the writes.

## Recovery Techniques using Immediate Update

Using this protocol, updates are applied to the database as they occur without waiting to reach the commit point. As well as having to redo the updates of committed transactions following a failure, it may now be necessary to undo the effects of transactions that had not committed at the time of failure. In this case, we use the log file to protect against system failures in the following way:

- When a transaction starts, write a transaction start record to the log.
- When a write operation is performed, write a record containing the necessary data to the log.
- Once the log record is written, write the update to the database buffers.
- The updates to the database itself are written when the buffers are next flushed to secondary storage.
- When the transaction commits, write a transaction commit to the log.

It is essential that log records are written before the corresponding write to the database. This is known as the write-ahead log protocol. If updates were made to the database first, and failure occurred before the log record was written, then the recovery manager would have no way of undoing (or redoing) the operation. Under the write-ahead log protocol, the recovery manager can safely assume that, if there is no transaction commit record in the log file for a particular transaction, then that transaction was still active at the time of failure, and must, therefore, be undone.

If a transaction aborts, the log can be used to undo it, since it contains all the old values for the updated fields. As a transaction may have performed several changes to an item, the writes are undone in reverse order. Regardless of whether the transaction’s writes have been applied to the database itself, writing the before-images guarantees that the database is restored to its state prior to the start of the transaction.

If the system fails, recovery involves using the log to undo or redo transactions. For any transaction, T, for which both a transaction start and transaction commit record appear in the log, we redo using the log records to write the after-image of updated fields. Note that if the new values have already been written to the database, these writes, though unnecessary, will have no effect.

However, any write that did not actually reach the database will now be performed. For any transaction, S, for which the log contains a transaction start record but not a transaction commit record, we need to undo that transaction. This time the log records are used to write the before-image of the affected fields, and thus restore the database to its state prior to the transaction’s start. The undo operations are performed in reverse order in which they are written to the log.

## Shadow Paging

An alternative to the log-based recovery schemes is shadow paging. This scheme maintains two page tables during the life of a transaction, a current page table and a shadow page table. When the transaction starts, the two page tables are the same. The shadow page table is never changed thereafter and is used to restore the database in the event of a system failure. During the transaction, the current page table is used to record all updates to the database. When the transaction completes, the current page table becomes the shadow page table. Shadow paging has several advantages to the log-based schemes: the overhead of maintaining the log file is eliminated, and recovery is significantly faster since there is no need for undo and redo operations. However, it has disadvantages as well, such as data fragmentation and the need for periodic garbage collection to reclaim inaccessible blocks.
`

// Define the Course data to be seeded
const courseData = [
    {
        name: 'Advanced Database',
        description: `This course covers advanced database topics such as recovery, concurrency control, and distributed databases. It also covers the internals of database systems, including query processing and optimization, transaction processing, and storage strategies.`,
        image: 'https://random.imagecdn.app/500/150',
        teacherId: 'clq15wvkn0000g0iu9njfg6z0'
    },
];

async function seedCoursesAndUnits() {

    for (const data of courseData) {
        await prisma.course.create({
            data,
        });
    }

    const courses = await prisma.course.findMany();

    const units = await Promise.all(courses.map(async (course) => {
        let count = 0;
        const units = [];
        while (count < 6) {
            units.push(
                prisma.unit.create({
                    data: {
                        name: `Database Recovery and Backup ${count + 1}`,
                        description: description,
                        content: markdown,
                        courseId: course.id,
                    }
                })
            );
            count++;
        }
        return Promise.all(units);
    }));

    courses.map(async (course) => {
        await prisma.enrollment.create(
            {
                data: {
                    userId: "clq15ycyc0005g0iuxv7fka8d",
                    courseId: course.id
                }
            }
        )
    })

    await vectorStore.addModels(units.flat());
}

async function main() {
    try {
        await prisma.enrollment.deleteMany();
        await prisma.unit.deleteMany();
        await prisma.course.deleteMany();
        await seedCoursesAndUnits();
    } catch (e) {
        throw e;
    } finally {
        await prisma.$disconnect();
    }
}

main();