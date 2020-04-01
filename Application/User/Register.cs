using System;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Application.Errors;
using Application.Interfaces;
using Application.Validators;
using Domain;
using FluentValidation;
using MediatR;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.User
{
    public class Register
    {
        public class Command : IRequest<User>
        {
            public string DisplayName { get; set; }
            public string Username { get; set; }
            public string Email { get; set; }
            public string Password { get; set; }
        }

        public class CommandValidator : AbstractValidator<Command>
        {
            public CommandValidator()
            {
                RuleFor(x => x.DisplayName).NotEmpty();
                RuleFor(x => x.Username).NotEmpty();
                RuleFor(x => x.Email).NotEmpty().EmailAddress();
                RuleFor(x => x.Password).Password();
            }
        }

        public class Handler : IRequestHandler<Command, User>
        {
            private readonly DataContext _context;
            private readonly UserManager<AppUser> _userManager;
            private readonly IJWTGenerator _jWTGenerator;
            public Handler(DataContext context, UserManager<AppUser> userManager, IJWTGenerator jWTGenerator)
            {
                _jWTGenerator = jWTGenerator;
                _userManager = userManager;
                _context = context;
            }

            public async Task<User> Handle(Command request, CancellationToken cancellationToken)
            {
                // Handler Logic goes HERE

                if( await _context.Users.Where(x => x.Email == request.Email).AnyAsync() )
                {
                    throw new RestException(System.Net.HttpStatusCode.BadRequest, new {Email = "EMail already exist"});
                }

                if( await _context.Users.Where(x => x.UserName == request.Username).AnyAsync() )
                {
                    throw new RestException(System.Net.HttpStatusCode.BadRequest, new {Username = "UserName already exist"});
                }

                var user = new AppUser
                {
                    DisplayName = request.DisplayName,
                    Email = request.Email,
                    UserName = request.Username
                };



                var result = await  _userManager.CreateAsync(user, request.Password);

                if (result.Succeeded)
                {
                    return new User{
                        DisplayName = user.DisplayName,
                        Token = _jWTGenerator.CreateToken(user),
                        Username = user.UserName,
                        Image = ""
                    };
                }

                throw new Exception("Problem creating user");

            }
        }
    }
}
