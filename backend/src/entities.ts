import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';
@Entity() export class User {
  @PrimaryGeneratedColumn('uuid') id: string;
  @Column({ unique: true }) email: string;
  @Column() password: string;
  @Column() role: string; // seeker | recruiter
}
@Entity() export class Profile {
  @PrimaryGeneratedColumn('uuid') id: string;
  @Column() userId: string;
  @Column() fullName: string;
  @Column() city: string;
  @Column({ default: '' }) education: string;
  @Column({ default: '' }) headline: string;
  @Column({ default: 'unemployed' }) status: string;
  @Column('text', { array: true, default: '{}' }) skills: string[];
  @Column('jsonb', { default: [] }) experience: any[];
  @CreateDateColumn() createdAt: Date;
}
@Entity() export class Post {
  @PrimaryGeneratedColumn('uuid') id: string;
  @Column() profileId: string;
  @Column() type: string; // project | skill | work | progress
  @Column() title: string;
  @Column({ default: '' }) body: string;
  @Column('text', { array: true, default: '{}' }) skills: string[];
  @CreateDateColumn() createdAt: Date;
}
@Entity() export class Job {
  @PrimaryGeneratedColumn('uuid') id: string;
  @Column() recruiterId: string;
  @Column() title: string;
  @Column() company: string;
  @Column() city: string;
  @Column({ default: '' }) description: string;
  @CreateDateColumn() createdAt: Date;
}
@Entity() export class Application {
  @PrimaryGeneratedColumn('uuid') id: string;
  @Column() jobId: string;
  @Column() profileId: string;
  @CreateDateColumn() createdAt: Date;
}
