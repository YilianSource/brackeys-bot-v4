import {
    Column,
    Entity,
    ManyToOne,
    OneToMany,
    PrimaryGeneratedColumn,
} from "typeorm";
import { Scope } from "../../structures/enums/scopes";
import { GuildState } from "./GuildState";
import { Infraction } from "./Infraction";

@Entity({ name: "memberStates" })
export class MemberState {
    @PrimaryGeneratedColumn()
    _id: string;

    @Column()
    memberId: string;

    @Column()
    _scopes: string = "";

    @ManyToOne((type) => GuildState, (guildState) => guildState.memberStates)
    guildState: Promise<GuildState>;

    @OneToMany((type) => Infraction, (infraction) => infraction.memberState)
    infractions: Promise<Infraction[]>;

    scopes(): Scope[] {
        return (
            this._scopes
                .split("-")
                /* Filters away empty strings when there are no scopes granted at first */
                .filter(Boolean)
                .map((str) => (Scope as any)[str])
        );
    }

    setScopes(scopes: Scope[]): Scope[] {
        this._scopes = scopes.join("-");
        return this.scopes();
    }

    addScope(scope: Scope): Scope[] {
        const scopes = this.scopes();
        if (!scopes.includes(scope)) scopes.push(scope);
        return this.setScopes(scopes);
    }

    removeScope(scope: Scope): Scope[] {
        const scopes = this.scopes();
        if (scopes.includes(scope)) scopes.splice(scopes.indexOf(scope), 1);
        return this.setScopes(scopes);
    }
}
