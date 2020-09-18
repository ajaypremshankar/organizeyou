import { TaskTemplate } from "../../types/types";

export class TaskTemplateState {
    private readonly _templates: Map<number, TaskTemplate>

    private constructor(templates: Map<number, TaskTemplate>) {
        this._templates = templates;
    }

    get templates(): Map<number, TaskTemplate> {
        return this._templates;
    }

    public addOrUpdateTemplate = (tt: TaskTemplate) => {
        this.templates.set(tt.id, tt)
        return this.mergeAndCreateNewState(this)
    }

    public deleteTemplate = (id: number) => {
        this.templates.delete(id)
        return this.mergeAndCreateNewState(this)
    }

    public addOrUpdateTemplates = (tt: TaskTemplate[]) => {
        tt.forEach(x => this.templates.set(x.id, x))
        return this.mergeAndCreateNewState(this)
    }

    public static emptyState = () => {
        return new TaskTemplateState(new Map<number, TaskTemplate>())
    }

    private mergeAndCreateNewState = (toBeMerged: any) => {
        return TaskTemplateState.newStateFrom(
            new Map<number, TaskTemplate>(toBeMerged.templates || this.templates),
        )
    }

    public static newStateFrom = (templates: Map<number, TaskTemplate>) => {
        return new TaskTemplateState(templates)
    }
}