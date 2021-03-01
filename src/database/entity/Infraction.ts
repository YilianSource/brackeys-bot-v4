import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm";
import { GuildState } from "./GuildState";
import { MemberState } from "./MemberState";

@Entity({ name: "infractions" })
export class Infraction {
    @PrimaryGeneratedColumn()
    _id: number;

    @Column()
    infractionId: number;

    @Column()
    description: number;

    @Column()
    createdAt: Date;

    @ManyToOne((type) => MemberState, (member) => member.infractions)
    memberState: MemberState;

    @ManyToOne((type) => GuildState, (guild) => guild.infractions)
    guildState: GuildState;
}
