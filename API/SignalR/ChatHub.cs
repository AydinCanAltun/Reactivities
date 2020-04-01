using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using Application.Comments;
using MediatR;
using Microsoft.AspNetCore.SignalR;

namespace API.SignalR
{
    public class ChatHub : Hub
    {
        private readonly IMediator _mediator;
        public ChatHub(IMediator mediator)
        {
            _mediator = mediator;
        }

        private string getUserName()
        {
            return Context.User?.Claims?.FirstOrDefault(x => x.Type == ClaimTypes.NameIdentifier)?.Value;
        }

        public async Task SendComment(Create.Command command)
        {
            var username = getUserName();

            command.Username = username;

            var comment = await _mediator.Send(command);

            await Clients.Group(command.ActivityId.ToString()).SendAsync("ReceiveComment", comment);

        }

        public async Task AddToGroup(string GroupName)
        {
            var username = getUserName();
            await Groups.AddToGroupAsync(Context.ConnectionId, GroupName);
            await Clients.Group(GroupName).SendAsync("Send", $"{username} has joined the group");

        }

        public async Task RemoveFromGroup(string GroupName)
        {
            var username = getUserName();
            await Groups.RemoveFromGroupAsync(Context.ConnectionId, GroupName);
            await Clients.Group(GroupName).SendAsync("Send", $"{username} has left the group");

        }

    }
}