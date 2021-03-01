import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
import { Scope } from "../../structures/enums/scopes";
import { Infraction } from "./Infraction";
import { MemberState } from "./MemberState";

@Entity({ name: "guildStates" })
export class GuildState {
    @PrimaryGeneratedColumn()
    _id: number;

    @Column()
    guildId: string;

    @Column()
    name: string;

    @Column()
    prefix: string = "!";

    @OneToMany((type) => MemberState, (member) => member.guildState)
    memberStates: Promise<MemberState[]> = Promise.resolve([]);

    @OneToMany((type) => Infraction, (infraction) => infraction.guildState)
    infractions: Promise<Infraction[]> = Promise.resolve([]);

    @Column()
    latestInfractionIndex: number = 0;

    // Format: role_id_1-scope_1,scope2,scope3/role_id_2-scope_1,scope_2,
    @Column()
    private _rolesScopes: string = "";

    rolesScopes(): RoleScopes[] {
        return this._rolesScopes.split("/").map((roleScopesStr) => {
            return {
                roleId: roleScopesStr.split("-")[0],
                scopes: roleScopesStr
                    .split("-")[1]
                    .split(",")
                    .map((scopesStr) => (Scope as any)[scopesStr]),
            };
        });
    }

    setRolesScopes(rolesScopes: RoleScopes[]): void {
        this._rolesScopes = rolesScopes
            .map(
                (roleScopes) =>
                    `${roleScopes.roleId}-${roleScopes.scopes.join(",")}`
            )
            .join("/");
    }
}

/**
 * Allows roles to have scopes
 */

export type RoleScopes = {
    roleId: string;
    scopes: Scope[];
};
