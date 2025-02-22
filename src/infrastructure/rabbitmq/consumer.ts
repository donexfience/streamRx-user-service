import { QUEUES, RabbitMQConnection, RabbitMQConsumer } from 'streamrx_common';
import amqplib from 'amqplib';
import { Injectable } from '@nestjs/common';
import { UpdateUserByEmailUseCase } from 'src/application/use-cases/updateUserByEmailUsecase';

@Injectable()
export class UserServiceConsumer {
  private rabbitMQConsumer: RabbitMQConsumer;
  private udpateUserByEmailUseCase: UpdateUserByEmailUseCase;
  private rabbitMQConnection: RabbitMQConnection;

  constructor(updateUserByEmailUseCase: UpdateUserByEmailUseCase) {
    this.rabbitMQConnection = RabbitMQConnection.getInstance();
    this.rabbitMQConsumer = new RabbitMQConsumer(this.rabbitMQConnection);
    this.udpateUserByEmailUseCase = updateUserByEmailUseCase;
  }

  public async start() {
    try {
      await this.rabbitMQConnection.connect(
        process.env.RABBITMQ_HOST || 'amqp://localhost',
      );

      await this.rabbitMQConsumer.consumeFromExchange(
        'userrole-changed',
        this.handleUserUpdatedByEmailMessage.bind(this),
      );

      // queue based consuming
      //   await this.rabbitMQConsumer.consume(
      //     QUEUES.USER_CREATED,
      //     this.handleUserCreatedMessage.bind(this)
      //   );

      console.log(
        '[INFO] Started consuming messages from RabbitMQ queues and exchanges.',
      );
    } catch (error) {
      console.error('[ERROR] Failed to start consuming:', error);
      throw error;
    }
  }

  private async handleUserUpdatedByEmailMessage(
    msg: amqplib.ConsumeMessage | null,
  ) {
    if (!msg) return;

    try {
      const message = JSON.parse(msg.content.toString());
      console.log('[INFO] User Updated message:', message);
      console.log(message.role, 'role from message that is consumed');
      await this.udpateUserByEmailUseCase.execute(message.email, message.role);
    } catch (error) {
      console.error('[ERROR] Failed to handle user updated message:', error);
      throw error;
    }
  }
}
